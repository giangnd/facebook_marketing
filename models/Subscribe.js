'user strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SubscribeSchema = mongoose.Schema({
    shopify_domain: String,
    userRef: String,
});

module.exports = mongoose.model('Subscribe', SubscribeSchema);
