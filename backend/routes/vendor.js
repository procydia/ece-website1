const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/auth');
const jwt = require("jsonwebtoken");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST api/vendors/upload/:id - Upload a profile picture
router.post('/upload/:id', upload.single('profilepicture'), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    vendor.profilepicture = req.file.path; // Update the profile picture path
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || vendor.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ vendor: { id: vendor.id } }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/vendor/profile - Get the logged-in vendor's profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select('-password'); // Exclude the password field
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Other routes (Create, Get by ID, etc.)
router.post('/', async (req, res) => {
  const { companyName, ownerName, panGst, productSelection, password, email } = req.body;
  try {
    const newVendor = new Vendor({
      companyName,
      ownerName,
      panGst,
      productSelection,
      email,
      password
    });
    const vendor = await newVendor.save();
    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;
