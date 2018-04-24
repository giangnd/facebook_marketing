// start.js
const mongoose = require('mongoose');
const throng = require('throng');
const config = require('./config');

require('dotenv').config({ path: '.env' });


// function start() {
//   /* You should require your models here so you don't have to initialise them all the time in
//   different controlers*/
//   // require('./models/Shop');

// }


// throng({
//   workers: process.env.WEB_CONCURRENCY || 1,
// }, start);
