/**
 * ./routes/api.js
 * This is where you'll set up any REST api endpoints you plan on using.
 */
const express = require('express');
const config = require('../config');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.get('/js/recart.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.render('app/javascripts/recart', {
    fbAppId: '283604478840722',
    fbPageId: '178407809574589',
    layout: null,
  });
});

module.exports = router;
