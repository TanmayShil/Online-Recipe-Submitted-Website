const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    name: {
        type: String,
        required: 'This fild is required'
    },
    description: {
        type: String,
        required: 'This fild is required'
    },
    // email: {
    //     type: String,
    //     required: 'This fild is required'
    // },
    ingredients: {
        type: Array,
        required: 'This fild is required'
    },
    category: {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian',],
        required: 'This fild is required'
    },
    image: {
        type: String,
        required: 'This fild is required'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
recipeSchema.index({ name: 'text', description: 'text' });
//wildcard indexing
//recipeSchema.index({ "$**": 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);