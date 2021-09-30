// NPM Packages
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const AppointmentSetupController = require('../controllers/appointmentSetting');

router.get('/', AppointmentSetupController.findAll);
router.get('/findByUserId/:userId', AppointmentSetupController.findByUserId);

router.post('/', checkAuth, AppointmentSetupController.appointmentSetting_create_appointmentSetting);

// router.get('/:appointmentSettingId', AppointmentSetupController.appointmentSetting_get_appointmentSetting);

// Update a Note with  appointmentSetupId
router.put('/:appointmentSettingId', checkAuth, AppointmentSetupController.appointmentSetting_update_appointmentSetting);

router.patch('/:appointmentSettingId', checkAuth, AppointmentSetupController.appointmentSetting_update_appointmentSetting);

router.delete('/:appointmentSettingId', checkAuth, AppointmentSetupController.appointmentSetting_delete_appointmentSetting);

module.exports = router;