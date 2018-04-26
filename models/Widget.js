'user strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var WidgetSchema = mongoose.Schema({
    shopify_domain: String,
    discountWidget: Object,
    addToCartWidget: Object,
});

module.exports = mongoose.model('Widget', WidgetSchema);
