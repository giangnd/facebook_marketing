const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const config = require('./config');

require('dotenv').config();

const app = express();
app.use(cors());

const hbs = require('hbs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('view options', { layout: 'layout' });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.use(session({
  name: 'ReCart',
  secret: process.env.SESSION_SECRET || 'coocoocachoo',
  cookie: { secure: true, maxAge: (24 * 60 * 60 * 1000) },
  saveUninitialized: true,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI || config.MONGODB_URI, {
  useMongoClient: true,
});

mongoose.Promise = require('bluebird');

mongoose.connection.on('error', (err) => {
  console.error(`🚫 Database Error 🚫  → ${err}`);
});
mongoose.connection.once('open', () => {
  console.log('MongoDB is connected!');
});

// Routes
const index = require('./routes/index');
const install = require('./routes/install');
const webhook = require('./routes/webhook');
const proxy = require('./routes/proxy');
const api = require('./routes/api');
const messenger = require('./routes/app/messenger');
const campaign = require('./routes/app/campaign');
const assets = require('./routes/app/assets');
const setting = require('./routes/app/setting');

app.use('/', index);
app.use('/install', install);
app.use('/webhook', webhook);
app.use('/proxy', proxy);
app.use('/api', api);
app.use('/messenger', messenger);
app.use('/campaigns', campaign);
app.use('/assets', assets);
app.use('/settings', setting);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = app;
