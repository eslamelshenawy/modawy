// NPM Packages
const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const DoctorsController = require('../controllers/doctors');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else
        cb(null, false);

}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 mega bytes
    },
    fileFilter: fileFilter
});


router.get('/', DoctorsController.findAll);

// router.post('/', checkAuth, upload.single('docImage'), DoctorsController.doctors_create_doctor);
router.post('/', DoctorsController.doctors_create_doctor);

router.get('/:doctorId', DoctorsController.doctors_get_doctor);


router.patch('/:doctorId', DoctorsController.doctors_update_doctor);

router.delete('/:doctorId', DoctorsController.doctors_delete_doctor);

module.exports = router;