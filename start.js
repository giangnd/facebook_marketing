// start.js
const mongoose = require('mongoose');
const throng = require('throng');
const config = require('./config');

require('dotenv').config({ path: '.env' });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || config.MONGODB_URI, {
  useMongoClient: true,
  server: {
    socketOptions: {
      connectTimeoutMS: 30000,
      keepAlive: 1
    }
  },
  replset: {
    socketOptions: {
      connectTimeoutMS: 30000,
      keepAlive: 1
    }
  },
});

mongoose.connection.on('error', (err) => {
  console.error(`🚫 Database Error 🚫  → ${err}`);
});
mongoose.connection.once('open', () => {
  console.log('[MongoDB] is connected!');
});

const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// function start() {
//   /* You should require your models here so you don't have to initialise them all the time in
//   different controlers*/
//   // require('./models/Shop');

// }


// throng({
//   workers: process.env.WEB_CONCURRENCY || 1,
// }, start);
