const Widget = require('../models/Widget');
const Subscribe = require('../models/Subscribe');
const request = require('request');
const Promise = require('bluebird');
const currencyFormatter = require('currency-formatter');

function getSubscribes(shop) {
    return new Promise((resolve, reject) => {
        const query = Subscribe.find({ shopify_domain: shop }).exec();
        query.then((response) => {
            resolve(response);
        });
    });
}

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

function abandonedCart1(shop, cart = null) {
    const scheduleInterval = '60mins';
    const introText = "Hey there!\nWe noticed that you left some great items in your cart. Don't worry, we saved them for you:";
    const title = "We saved your cart";
    const subtitle = "Come back and complete your purchase today!";
    const buttonText = "Return to Checkout";

    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "top_element_style": "large",
                "elements": [
                    {
                        "title": title,
                        "subtitle": subtitle,
                        "image_url": "https://static.ghostmonitor.com/messenger/abandonment-campaign-preview-bg.jpg",
                        "buttons": [
                            {
                                "title": buttonText,
                                "type": "web_url",
                                "url": `https://${shop}/checkout`,
                                "webview_height_ratio": "tall",
                            }
                        ]
                    }
                ],
                "buttons": [
                    {
                        "title": buttonText,
                        "type": "web_url",
                        "url": `https://${shop}/checkout`,
                    }
                ]
            }
        }
    };

    if (cart) {
        JSON.parse(cart).items.forEach(element => {
            if (messageData.attachment.payload.elements.length <= 3) {
                const price = currencyFormatter.format(element.price / 100, { code: cart.currency });
                messageData.attachment.payload.elements.push({
                    title: element.title,
                    image_url: element.image,
                    subtitle: element.quantity + ' x ' + price,
                    default_action: {
                        type: "web_url",
                        url: `https://${shop}${element.url}`,
                        webview_height_ratio: "tall"
                    }
                });
            }
        });
    }

    return { scheduleInterval, introText, title, subtitle, buttonText, messageData };
}

function sendMessenger(token, userRef, message) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: token },
            method: 'POST',
            json: {
                recipient: {
                    user_ref: userRef,
                },
                message: message,
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

exports.getSubscribes = getSubscribes;
exports.defineWidget = defineWidget;
exports.sendMessenger = sendMessenger;
exports.abandonedCart1 = abandonedCart1;