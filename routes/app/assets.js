
const express = require('express');
const config = require('../../config');
const router = express.Router();

router.get('/js/recart.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.render('app/assets/recart-js', {
        fbAppId: '283604478840722',
        fbPageId: '178407809574589',
        layout: null,
    });
});

module.exports = router;