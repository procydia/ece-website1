const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profileimage: {
    type: String,
  },
  googleId: String,
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model("user", UserSchema);
