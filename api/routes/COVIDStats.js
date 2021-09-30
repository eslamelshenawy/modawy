// NPM Packages
const express = require('express');
const router = express.Router();
const COVIDStats = require('../controllers/covid-19');

router.get('/',  COVIDStats.getCOVIDStats);

module.exports = router;