const express = require('express');
const config = require('../../config');
const router = express.Router();

router.get('/', (req, res) => {
    const shop = req.query.shop;
    res.render('app/campaigns/dashboard', { shop });
});

module.exports = router;