const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true , unique: true},
  ownerName: { type: String,required: true },
  email: {type: String,unique: true,required : true},
  password: { type: String},
  panGst: { type: String, unique: true, required: true},
  productSelection: { type: String, required: true },
  profilepicture: {type: String},
  backgroundpicture: {type: String},
});

module.exports = mongoose.model('vendor', VendorSchema);
