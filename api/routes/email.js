// NPM Packages
const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email');

router.post('/sendEmail',  EmailController.send_email);

module.exports = router;