const express = require('express');
const config = require('../../config');
const router = express.Router();

router.get('/', (req, res, next) => res.render('app/messenger/dashboard'));

module.exports = router;