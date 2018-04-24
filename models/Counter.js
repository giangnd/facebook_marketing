'user strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CounterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

const Counter = mongoose.model('counter', CounterSchema);

module.exports = Counter;
