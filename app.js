// NPM Packages
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var cron = require('node-cron');
const cheerio = require('cheerio');
const request = require('request');

const doctorRoutes = require('./api/routes/doctors');
const reviewRoutes = require('./api/routes/reviews');
const specialisteRoutes = require('./api/routes/specialiste');
const insuranceRoutes = require('./api/routes/insurance');
const feedbackRoutes = require('./api/routes/feedback');
const userRoutes = require('./api/routes/user');
const indexRoutes = require('./api/routes/index');
const appointmentSettingRoutes = require('./api/routes/appointmentSetting');
const appointmentRoutes = require('./api/routes/appointment');
const imagesRoutes = require('./api/routes/images');
const emailRoutes = require('./api/routes/email');
const smsRoutes = require('./api/routes/sms');
const COVIDStatsRoutes = require('./api/routes/COVIDStats');
const dotenv = require('dotenv').config();


// Conect to DB
// for production
console.log('process.env.MONGO_ATLAS_PW', process.env.MONGO_ATLAS_PW);
// mongoose.connect('mongodb+srv://node-doc:' + process.env.MONGO_ATLAS_PW + '@name-rest-doc-3rvsc.mongodb.net/test?retryWrites=true&w=majority', {
mongoose.connect('mongodb+srv://drannerdbuser:' + process.env.MONGO_ATLAS_PW + '@drannerdb-inw6t.gcp.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('\x1b[32m', "Successfully connected to the database");
}).catch(err => {
    console.log('\x1b[31m', 'Could not connect to the database. Exiting now...', err);
    process.exit();
});
mongoose.Promise = global.Promise;


// cron.schedule('*/90 * * * *', () => {
//     console.log('running a task every 90 minute');
//     const url = 'https://modawy.herokuapp.com/specialistes';
//     request(url, (error, response, html) => {
//         console.log('response running a task every 30 minute');
//         if (!error && response.statusCode == 200) {
//         }
//     });
// });


// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works !'
//     });
// });
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

});


// Routes which should handle requests
app.use('/doctors', doctorRoutes);
app.use('/reviews', reviewRoutes);
app.use('/appointmentSettings', appointmentSettingRoutes);
app.use('/insurance', insuranceRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/specialistes', specialisteRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/images', imagesRoutes);
app.use('/user', userRoutes);
app.use('/email', emailRoutes);
app.use('/sms', smsRoutes);
app.use('/COVIDStats', COVIDStatsRoutes);
app.get('/', indexRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});


module.exports = app;