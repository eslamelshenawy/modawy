var twilio = require('twilio');
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure

const accountSid = 'AC818f755bc04f1c4b6ef69fad2d927419';
const authToken = '2739eb26b5cfb2dd3297ac5326a78b56';
const client = require('twilio')(accountSid, authToken);

const twilioPhoneNumber = '+16783210821';

exports.send_sms = (req, res, next) => {
    console.log(req.body);
    const phoneNumber = req.body.to;
    const name = req.body.name;
    const msg = req.body.msg;
    console.log(req.body);
    // Send the message!

    // Create options to send the message
    const options = {
        to: phoneNumber,
        from: twilioPhoneNumber,
        /* eslint-disable max-len */
        // body: `Hi ${name}. ${msg}`,
        body: `${msg}`,
        /* eslint-enable max-len */
    };
    // console.log('options->', options);
    client.messages.create(options, function (err, response) {
        if (err) {
            // Just log it for now
            console.error(err);
            res.status(500).json({
                message: err
            });
        } else {
            // console.log('options->', options);
            // Log the last few digits of a phone number
            console.log(`Message sent Successful `);
            res.status(201).json({
                message: 'Message sent Successful',
                res: response
            });
        }
    });


}