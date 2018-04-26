const Widget = require('../models/Widget');
const Promise = require('bluebird');

function defineWidget(shop) {
    return new Promise((resolve, reject) => {
        let discountWidget = {
            title: '15% Discount',
            subscribed_text: 'Your discount code has been sent to your FB messenger! Get it and enjoy saving shopping now!',
            button_text: 'Inbox My Discount Code Now',
            discount_message: 'We congrats you on activating your discount! Enter code SIGNUP15 at checkout stage to save 15% off your first purchase Enjoy saving shopping NOW!',
            menu_text: 'Get 15% discount NOW!',
        };
        let addToCartWidget = {
            title: 'Get 15% off from your order',
            discount_text: 'Your discount code:',
            discount_code: 'SIGNUP15',
            button_text: 'Get Your Discount',
        };

        const query = Widget.findOne({ shopify_domain: shop }).exec();
        query.then((response) => {
            const widget = response;
            if (widget) {
                if (widget.discountWidget) {
                    discountWidget = widget.discountWidget;
                }

                if (widget.addToCartWidget) {
                    addToCartWidget = widget.addToCartWidget;
                }
            }
            resolve({ discountWidget, addToCartWidget });
        });
    });
}

exports.defineWidget = defineWidget;