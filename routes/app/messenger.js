const express = require('express');
const config = require('../../config');
const router = express.Router();
const Widget = require('../../models/Widget');
const messengerController = require('../../controllers/messenger');

router.get('/', (req, res, next) => {
    const shop = req.query.shop;
    messengerController.defineWidget(shop).then(data => {
        res.render('app/messenger/dashboard', {
            discountWidget: data.discountWidget,
            addToCartWidget: data.addToCartWidget,
            shop,
        });
    }, err => next(err));
});

router.post('/discount', (req, res) => {
    const shop = req.query.shop;
    const query = Widget.findOne({ shopify_domain: shop }).exec();
    query.then((response) => {
        let save;
        const widget = response;
        const discountWidget = req.body;
        if (!widget) {
            save = new Widget({
                shopify_domain: shop,
                discountWidget: {
                    title: req.body.title,
                    subscribed_text: req.body.subscribed_text,
                    button_text: req.body.button_text,
                    discount_message: req.body.discount_message,
                    menu_text: req.body.menu_text,
                },
            }).save();
        } else {
            widget.discountWidget = discountWidget;
            save = widget.save();
        }
        save.then(() => res.redirect('/messenger/?shop=' + shop));
    });
});

router.post('/addtocart', (req, res) => {
    const shop = req.query.shop;
    const query = Widget.findOne({ shopify_domain: shop }).exec();
    query.then((response) => {
        let save;
        const widget = response;
        const addToCartWidget = req.body;
        if (!widget) {
            save = new Widget({
                shopify_domain: shop,
                addToCartWidget: {
                    title: req.body.title,
                    discount_text: req.body.discount_text,
                    discount_code: req.body.discount_code,
                    button_text: req.body.button_text,
                },
            }).save();
        } else {
            widget.addToCartWidget = addToCartWidget;
            save = widget.save();
        }
        save.then(() => res.redirect('/messenger/?shop=' + shop));
    });
});

module.exports = router;