// NPM Packages
const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms');

router.post('/sendSMS',  smsController.send_sms);

module.exports = router;