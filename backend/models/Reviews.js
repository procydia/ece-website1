const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    author: {type:String},
    date: {type: Date},
    review: {type: String},
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
      }
});

module.exports = mongoose.model("reviews", reviewsSchema);