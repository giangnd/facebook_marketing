'user strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SettingSchema = mongoose.Schema({
    shopify_domain: String,
    fbAppId: String,
    fbPageId: String,
    fbPageAccessToken: String,
});

module.exports = mongoose.model('Setting', SettingSchema);
