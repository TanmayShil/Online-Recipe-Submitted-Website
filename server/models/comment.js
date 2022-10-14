const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    name: {
        type: String,
        required: 'This fild is required'
    },
    email: {
        type: String,
        required: 'This fild is required'
    },
    mobile: {
        type: Number
    },
    message: {
        type: String,
        required: 'This fild is required'
    }
});
module.exports = mongoose.model('Comment', commentSchema);