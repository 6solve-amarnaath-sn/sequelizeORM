const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: 'apkkshree@gmail.com',
    pass: 'dimn dvim afyy gjqw',
  }
});

module.exports = transporter;