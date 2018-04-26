const config = require('../../config');
const express = require('express');
const router = express.Router();
const Widget = require('../../models/Widget');
const messengerController = require('../../controllers/messenger');
const settingController = require('../../controllers/setting');

router.get('/js/recart.js', (req, res, next) => {
    const shop = req.query.shop;
    settingController.defineSetting(shop).then(setting => {
        if (!setting || !setting.fbPageId)
            return res.send();

        messengerController.defineWidget(shop).then(widget => {
            res.set('Content-Type', 'application/javascript');
            res.render('app/assets/recart-js', {
                appUrl: config.APP_URI,
                discountWidget: widget.discountWidget,
                addToCartWidget: widget.addToCartWidget,
                fbAppId: setting.fbAppId,
                fbPageId: setting.fbPageId,
                shop,
                layout: null,
            });
        }, err => next(err));
    }, err => next(err));
});

module.exports = router;