// NPM Packages
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const AppointmentController = require('../controllers/appointment');

router.get('/', AppointmentController.findAll);

router.get('/findByDoctorId/:doctorId', AppointmentController.findByDoctorId);

router.get('/getAppointmentsByDoctorIdAndDate/:doctorId&:date', AppointmentController.getAppointmentsByDoctorIdAndDate);

router.get('/countPendingRequestsByDoctorId/:doctorId', AppointmentController.countPendingRequestsByDoctorId);

router.get('/findByUserId/:userId', AppointmentController.findByUserId);

router.post('/', checkAuth, AppointmentController.appointment_create_appointment);

// router.get('/:appointmentId', AppointmentController.appointment_get_appointment);

// Update a Note with  AppointmentId
router.put('/:appointmentId', checkAuth, AppointmentController.appointment_update_appointment);

router.patch('/:appointmentId', checkAuth, AppointmentController.appointment_update_appointment);

// router.delete('/:appointmentId', checkAuth, AppointmentController.appointment_delete_appointment);
router.delete('/:appointmentId', checkAuth, AppointmentController.appointment_delete_appointment);

module.exports = router;