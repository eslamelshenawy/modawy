// NPM Packages
const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/Feedback');
const checkAuth = require('../middleware/check-auth');


// sign up l
router.post('/', FeedbackController.create);
// router.post('/', checkAuth, FeedbackController.create);


router.get('/', FeedbackController.findAll);


module.exports = router;