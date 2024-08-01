const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// POST api/vendors - Create a new vendor
router.post('/', async (req, res) => {
  const { companyName, ownerName, panGst, productSelection } = req.body;
  try {
    const newVendor = new Vendor({
      companyName,
      ownerName,
      panGst,
      productSelection
    });
    const vendor = await newVendor.save();
    res.json(vendor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/vendors/:id - Get a vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ msg: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vendor not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
