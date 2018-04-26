'user strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShopSchema = mongoose.Schema({
  shopId: Number,
  shopify_domain: String, // Shopify domain without the .myshopify.com on the end.
  name: String,
  domain: String,
  supportEmail: String,
  nonce: String,
  accessToken: String,
  isActive: { type: Boolean, default: false },
  scriptId: Number,
});

module.exports = mongoose.model('Shop', ShopSchema);
