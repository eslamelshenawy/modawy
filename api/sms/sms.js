var twilio = require('twilio');
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC818f755bc04f1c4b6ef69fad2d927419';
const authToken = '2739eb26b5cfb2dd3297ac5326a78b56';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Wellcome To Dranner from mohamed',
     from: '+16783210821',
     to: '+966548293741'
   })
  .then(message => console.log(message.sid));