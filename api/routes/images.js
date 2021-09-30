const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const upload = require('../utils/upload');

const singleUpload = upload.single('image');
const prefex = "https://d1e26bxkez9rrv.cloudfront.net/"


// router.post('/image-upload', UserCtrl.authMiddleware, function(req, res) {
router.post('/upload', function (req, res) {
    // console.log('image-upload called');
    singleUpload(req, res, function (err) {
        if (err) {
            console.log('err', err);
            return res.status(422).send({
                errors: [{
                    title: 'Image Upload Error',
                    detail: err.message
                }]
            });
        }
        // console.log('req.file.location', req.file.location);
        // console.log('data', req.file);
        return res.json({
            'imageUrl': req.file.location
        });
    });
});



module.exports = router;