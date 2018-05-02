const Setting = require('../models/Setting');
const Promise = require('bluebird');

function defineSetting(shop) {
    return new Promise((resolve, reject) => {
        const fbAppId = '283604478840722';

        const query = Setting.findOne({ shopify_domain: shop }).exec();
        query.then((response) => {
            let setting = response;
            if (!setting || !setting.fbAppId) {
                setting.fbAppId = fbAppId;
            }
            resolve(setting);
        });
    });
}

exports.defineSetting = defineSetting;