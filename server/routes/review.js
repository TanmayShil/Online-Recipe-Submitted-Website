// const express = require('express');
// const router = express.Router({ mergeParams: true });
// const catchAsync = require('../utils/catchAsync');
// const Review = require('../models/review');
// const Recipe = require('../models/recipe');

// router.post('/', async (req, res) => {
//     const recipe = await Recipe.findById(req.params.id);
//     const review = new Review(req.body.review);
//     recipe.reviews.push(review);
//     await review.save();
//     await recipe.save();
//     res.redirect(`/recipe/${recipe._id}`);
// })
// router.delete('/:reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/recipe/${id}`);
// }))
