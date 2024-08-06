// backend/routes/api/reviews.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Reviews = require('../models/Reviews');

// @route    POST api/reviews
// @desc     Create a review
// @access   Public
router.post(
  '/',
  [
    check('author', 'Author is required').not().isEmpty(),
    check('review', 'Review text is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { author, review } = req.body;

    try {
      const newReview = new Reviews({
        author,
        review
      });

      const savedReview = await newReview.save();
      res.json(savedReview);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    GET api/reviews
// @desc     Get all reviews
// @access   Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Reviews.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/reviews/:id
// @desc     Get a single review by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route    PUT api/reviews/:id
// @desc     Update a review
// @access   Public
router.put(
  '/:id',
  [
    check('author', 'Author is required').not().isEmpty(),
    check('review', 'Review text is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { author, review } = req.body;

    try {
      let reviewToUpdate = await Reviews.findById(req.params.id);

      if (!reviewToUpdate) {
        return res.status(404).json({ msg: 'Review not found' });
      }

      reviewToUpdate.author = author;
      reviewToUpdate.review = review;

      await reviewToUpdate.save();
      res.json(reviewToUpdate);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Review not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route    DELETE api/reviews/:id
// @desc     Delete a review
// @access   Public
router.delete('/:id', async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    await review.remove();
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
