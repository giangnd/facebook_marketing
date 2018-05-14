'use strict';

const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

router.post('/', (req, res, next) => {
    Shop.findOneAndRemove({ shopify_domain: req.body.myshopify_domain }).exec().then((response) => {
        res.status(200).send('Remove shop success.');
    });
});

module.exports = router;