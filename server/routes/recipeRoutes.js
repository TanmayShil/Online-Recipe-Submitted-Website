const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
require('../models/database');
const Category = require('../models/category');
const Recipe = require('../models/recipe');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const { isLoggedIn, isAuthor } = require('../middleware');
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
// router.get('/recipe/:id/edit', recipeController.exploreRecipeEdit);
router.get('/categories', recipeController.explporeCategories);
router.get('/categories/:id', recipeController.explporeCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.explporeLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', isLoggedIn, catchAsync(recipeController.submitRecipe));
router.post('/submit-recipe', isLoggedIn, catchAsync(recipeController.submitRecipeOnPost));

//update recipe
router.get('/recipe/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    let { id } = req.params;
    let recipe = await Recipe.findById(id)
    if (!recipe) {
        req.flash('error', 'cannot find the campground')
        return res.redirect('/');
    }
    res.render('edit', { recipe });
}))
router.put('/recipe/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    req.flash('success', 'Successfully updated recipe!');
    res.redirect(`/recipe/${recipe._id}`)

}));

router.delete('/recipe/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted recipe!');
    res.redirect('/');
}));

module.exports = router;