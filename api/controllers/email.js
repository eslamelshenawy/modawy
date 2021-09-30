const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'm.alshenawy91@gmail.com',
//         pass: 'pass'
//     }
// });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'felipa48@ethereal.email',
//         pass: 'XbA6uf9g1Bahx2NUNd'
//     }
// });


// send grid
var transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'mshenawy',
        pass: 'mo7amed&*771991'
    }
});

// Message object
var passwordResetUrl ="https://modawy.com/en/dranner/forgetPassword"
let message = {
    from: 'notifications@modawy.com',
    to: 'hazemelshenawy93@gmail.com',
    subject: 'Dranner Test sending email from node js  D',
    // text: 'Hello to myself!',
    // html: '<p><b>Hello</b> how are you ! i hope u are right. this is mohamed from dranner. it\'s Just the Beginning. Stay tuned..</p>'
    html: `
        <p>Dear user,</p>
        <p>
                You can reset your password by going to
                <a href="${passwordResetUrl}">this link</a>
            </p>
        `
};
const mailOptions = {
    from: 'm.alshenawy91@email.com', // sender address
    to: 'mshenawy@ejada.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>' // plain text body
};


exports.send_email = (req, res, next) => {
    console.log(req.body);
    message.from = req.body.from;
    message.to = req.body.to;
    message.subject = req.body.subject;
    message.html = req.body.html;
    console.log(req.body);
    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
            console.log('send email.... ');
            res.status(500).json({
                message: err
            });
        } else {
            console.log(info);
            console.log('send email.... ');
            res.status(201).json({
                message: 'Email sent Successful',
                res: info
            });
        }

    });

}