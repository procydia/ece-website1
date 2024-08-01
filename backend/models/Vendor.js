const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  ownerName: { type: String, required: true },
  panGst: { type: String, required: true },
  productSelection: { type: String, required: true },
  image: {type: String, required: true},
});

module.exports = mongoose.model('Vendor', VendorSchema);
