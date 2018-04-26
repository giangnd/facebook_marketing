
const express = require('express');
const router = express.Router();
const Setting = require('../../models/Setting');
const settingController = require('../../controllers/setting');

router.get('/', (req, res) => {
    const shop = req.query.shop;
    settingController.defineSetting(shop).then(setting => {
        res.render('app/settings', { setting, shop });
    }, err => next(err));
});

router.post('/', (req, res) => {
    const shop = req.query.shop;
    const query = Setting.findOne({ shopify_domain: shop }).exec();
    query.then((response) => {
        let save;
        const setting = response;
        if (!setting) {
            save = new Setting({
                shopify_domain: shop,
                fbAppId: req.body.fbAppId,
                fbPageId: req.body.fbPageId,
                fbPageAccessToken: req.body.fbPageAccessToken,
            }).save();
        } else {
            setting.fbAppId = req.body.fbAppId;
            setting.fbPageId = req.body.fbPageId;
            setting.fbPageAccessToken = req.body.fbPageAccessToken;
            save = setting.save();
        }
        save.then(() => res.redirect('/settings/?shop=' + shop));
    });

});

module.exports = router;