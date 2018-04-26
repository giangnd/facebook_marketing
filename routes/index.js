const express = require('express');
const verifyOAuth = require('../helpers').verifyOAuth;
const config = require('../config');
const Shop = require('../models/Shop');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const query = Object.keys(req.query).map((key) => `${key}=${req.query[key]}`).join('&');

  if (req.query.shop) {
    Shop.findOne({ shopify_domain: req.query.shop, isActive: true }, (err, shop) => {
      if (!shop) {
        return res.redirect(`/install/?${query}`);
      }
      if (verifyOAuth(req.query)) {
        return res.render('app/app', { apiKey: config.SHOPIFY_API_KEY, appName: config.APP_NAME, appUrl: config.APP_URI, shop: shop.shopify_domain });
      }
      return res.render('index', { title: req.query.shop });
    });
  } else {
    return res.render('index', { title: 'Welcome to your example app' });
  }
});

router.get('/error', (req, res) => res.render('error', { message: 'Something went wrong!' }));

router.get('/home', (req, res, next) => {
  const shop = req.query.shop;
  res.render('app/app', { appName: config.APP_NAME, shop });
});

module.exports = router;
