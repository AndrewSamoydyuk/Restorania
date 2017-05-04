var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    auth: {
      user: 'myrestorania@gmail.com',
      pass: 'myRestorania2017'
    }
  })
);

module.exports.transport = transport;

