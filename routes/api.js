/**
 * ./routes/api.js
 * This is where you'll set up any REST api endpoints you plan on using.
 */
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const Setting = require('../models/Setting');
const Subscribe = require('../models/Subscribe');
const settingController = require('../controllers/setting');
const messengerController = require('../controllers/messenger');

const Cart = require('../models/Cart');
router.get('/test', (req, res, next) => {
    const shop = req.query.shop;
    settingController.defineSetting(shop).then(setting => {
        const token = setting.fbPageAccessToken;
        const query = Cart.find({ shopify_domain: shop, placedOrder: false }).exec();
        query.then((response) => {
            const carts = response;
            carts.forEach(element => {
                const introText = messengerController.abandonedCart1(shop).introText;
                const messageData = messengerController.abandonedCart1(shop, element.cartInfo).messageData;
                messengerController.sendMessenger(token, element.userRef, { text: introText }).then((sent) => {
                    messengerController.sendMessenger(token, element.userRef, messageData).then((sent) => {
                        res.json(sent);
                    }, err => next(err));
                }, err => next(err));
            });
        });
    }, err => next(err));
});

router.post('/fb/subscribe', (req, res, next) => {
    const userRef = req.body.userRef;
    const shop = req.query.shop;
    settingController.defineSetting(shop).then(setting => {
        const token = setting.fbPageAccessToken;
        messengerController.defineWidget(shop).then(widget => {
            messengerController.sendMessenger(token, userRef, { text: widget.discountWidget.discount_message }).then(() => {
                const query = Subscribe.findOne({ shopify_domain: shop, userRef: userRef }).exec();
                query.then((response) => {
                    let save;
                    const subs = response;
                    if (!subs) {
                        save = new Subscribe({
                            shopify_domain: shop,
                            userRef: userRef,
                        }).save();
                        save.then(() => res.send(response));
                    } else {
                        res.send();
                    }
                });
            }, err => next(err));
        }, err => next(err));
    }, err => next(err));
});

module.exports = router;
