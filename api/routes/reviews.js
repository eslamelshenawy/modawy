// NPM Packages
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ReviewsController = require('../controllers/reviews');

router.get('/', ReviewsController.reviews_get_all);

router.post('/', checkAuth, ReviewsController.reviews_create_review);

router.get('/:reviewId', ReviewsController.reviews_get_review);

router.get('/findByDoctorId/:doctorId/:pageNo/:size', ReviewsController.findByDoctorIdBagination);

router.get('/findByDoctorId/:doctorId', ReviewsController.findByDoctorId);

router.get('/findByAppointmentId/:appointmentId', ReviewsController.findByAppointmentId);

router.get('/findByDoctorIdAndUserId/:doctorId/:userId/', ReviewsController.findByDoctorIdAndUserId);

router.get('/findStatisticsByDoctorId/:doctorId', ReviewsController.findStatisticsByDoctorId);

// Update a Note with  AppointmentId
router.put('/:reviewId', checkAuth, ReviewsController.reviews_update_review);

router.patch('/:reviewId', checkAuth, ReviewsController.reviews_update_review);

router.delete('/:reviewId', checkAuth, ReviewsController.reviews_delete_review);

module.exports = router;