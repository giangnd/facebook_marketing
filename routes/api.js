/**
 * ./routes/api.js
 * This is where you'll set up any REST api endpoints you plan on using.
 */
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const request = require('request');
const Setting = require('../models/Setting');
const Subscribe = require('../models/Subscribe');
const settingController = require('../controllers/setting');
const messengerController = require('../controllers/messenger');

router.post('/fb/subscribe', (req, res, next) => {
    const userRef = req.body.userRef;
    const shop = req.query.shop;
    settingController.defineSetting(shop).then(setting => {
        const token = setting.fbPageAccessToken;
        messengerController.defineWidget(shop).then(widget => {
            sendTextMessenger(token, userRef, widget.discountWidget.discount_message).then(() => {
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

function sendTextMessenger(token, userRef, message) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: token },
            method: 'POST',
            json: {
                recipient: {
                    user_ref: userRef,
                },
                message: {
                    text: message,
                },
            }
        }, (error, response, body) => {
            if (error) {
                return reject(error);
            } else if (response.body.error) {
                return reject(response.body.error);
            } else {
                resolve(body);
            }
        });
    });

}

module.exports = router;
