// NPM Packages
const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
// const app = require('/app.js');


router.get('/', (req, res, next) => {
    res.send('Server is up !\n and mongoose.connection.readyState: ' + mongoose.connection.readyState);
    console.dir('Server is up !');
    console.log('mongoose.connection.readyState :' + mongoose.connection.readyState);

});


module.exports = router;