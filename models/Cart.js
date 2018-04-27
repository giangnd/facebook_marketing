'user strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CartSchema = mongoose.Schema({
    shopify_domain: String,
    userRef: String,
    cartToken: String,
    cartInfo: Object,
    placedOrder: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CartSchema.pre('save', function (next) {
    if (!this.updatedAt)
        this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Cart', CartSchema);
