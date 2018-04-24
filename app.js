const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const hbs = require('hbs');

require('dotenv').config();

const app = express();

// view engine setup
// hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
// hbs.registerPartials(__dirname + '/views/partials');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
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
// Routes
const index = require('./routes/index');
const install = require('./routes/install');
const webhook = require('./routes/webhook');
const proxy = require('./routes/proxy');
const api = require('./routes/api');
const messenger = require('./routes/messenger');
const campaign = require('./routes/campaign');

app.use('/', index);
app.use('/install', install);
app.use('/webhook', webhook);
app.use('/proxy', proxy);
app.use('/api', api);
app.use('/messenger', messenger);
app.use('/campaigns', campaign);

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

module.exports = app;
