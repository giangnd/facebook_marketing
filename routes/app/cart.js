const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart');

router.post('/update', (req, res, next) => {
    const shop = req.query.shop;
    const userRef = req.body.userId;
    const cartToken = req.body.cartToken;
    const cartInfo = req.body.cartInfo;
    const query = Cart.findOne({ shopify_domain: shop, userRef: userRef }).exec();
    query.then((response) => {
        let save;
        const cart = response;
        if (!cart) {
            save = new Cart({
                shopify_domain: shop,
                userRef: userRef,
                cartToken: cartToken,
                cartInfo: cartInfo,
            }).save();
        } else {
            cart.cartToken = cartToken;
            cart.cartInfo = cartInfo;
            cart.updatedAt = Date.now();
            save = cart.save();
        }
        save.then(() => res.send(cart));
    });
});

router.post('/placedOrder', (req, res, next) => {
    const shop = req.query.shop;
    const userRef = req.body.userId;
    const query = Cart.findOne({ shopify_domain: shop, userRef: userRef }).exec();
    query.then((response) => {
        let save;
        const cart = response;
        if (cart) {
            cart.placedOrder = true;
            cart.updatedAt = Date.now();
            save = cart.save();
            save.then(() => res.send(cart));
        }
    });
});

module.exports = router;