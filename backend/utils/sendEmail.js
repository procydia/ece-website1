const nodemailer = require('nodemailer');
const config = require('config');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.get('emailUser'),
      pass: config.get('emailPass')
    }
  });

  const mailOptions = {
    from: config.get('emailUser'),
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email', error);
  }
};

module.exports = sendEmail;
