const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/auth/google
// @desc     Authenticate user with Google & get token
// @access   Public
router.post('/google', async (req, res) => {
  const { tokenId } = req.body;
  const client = new OAuth2(config.get('googleClientId'), config.get('googleClientSecret'));
  
  client.verifyIdToken({ idToken: tokenId, audience: config.get('googleClientId') })
    .then(async (response) => {
      const { email_verified, email, name } = response.payload;
      if (email_verified) {
        let user = await User.findOne({ email });
        if (user) {
          const payload = { user: { id: user.id } };
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } else {
          user = new User({
            username: name,
            email,
            password: 'google_oauth',
            googleId: response.payload.sub
          });
          await user.save();
          const payload = { user: { id: user.id } };
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    })
    .catch(err => {
      res.status(400).json({ errors: [{ msg: 'Google authentication failed' }] });
    });
});

// @route    POST api/auth/otp
// @desc     Send OTP to user's email
// @access   Public
router.post('/otp', [
  check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 3600000; // 1 hour

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}. It will expire in 1 hour.`);

    res.json({ msg: 'OTP sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth/otp/verify
// @desc     Verify OTP
// @access   Public

router.post('/otp/verify', [
  check('email', 'Please include a valid email').isEmail(),
  check('otp', 'OTP is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ errors: [{ msg: 'Invalid OTP' }] });
    }

    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
