const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const config = require('config');

// Get email and password from config
const email = config.get('emailUser');
const password = config.get('emailPass');

// Utility function to send OTP via email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Route to generate and send OTP
router.post('/generate', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendOTP(email, otp);

    // Store OTP and expiration time in user record
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpires: Date.now() + 10 * 60 * 1000 }, // 10 minutes expiration
      { new: true, upsert: true }
    );

    res.json({ msg: 'OTP sent', otp });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to verify OTP
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // OTP is valid, clear OTP and expiration
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
