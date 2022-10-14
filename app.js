const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./server/models/user');
//const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { isLoggedIn, isAuthor, isReviewAuthor } = require('./server/middleware');
//const MongoDBStore = require('connect-mongo')(session);
//error handler
const catchAsync = require('./server/utils/catchAsync');
const expressError = require('./server/utils/expressError');

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(cookieParser('CookingBlogSecure'));
app.use(mongoSanitize({
    replaceWith: '_'
}))
// const store = new MongoDBStore({
//     url: 'mongodb://localhost:27017/my-recipe',
//     secret: 'CookingBlogSecretSession',
//     touchAfter: 24 * 60 * 60
// });
// store.on("error", function (e) {
//     console.log("store error", e)
// })
const sessionConfig = {
    // store,
    name: 'session',
    secret: 'CookingBlogSecretSession',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAage: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(fileUpload());
app.use(flash());
//app.use(helmet({ contentSecurityPolicy: false }));
//passport setup 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash handler
app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);
const usersRoutes = require('./server/routes/users');
app.use('/', usersRoutes);

//review
require('./server/models/database');
const Review = require('./server/models/review');
const Recipe = require('./server/models/recipe');
app.post('/recipe/:id/reviews', isLoggedIn, (async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    recipe.reviews.push(review);
    await review.save();
    await recipe.save();
    res.redirect(`/recipe/${recipe._id}`);
}))
app.delete('/recipe/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/recipe/${id}`);
}))
//comment
const Comment = require('./server/models/comment');

app.post('/comment', catchAsync(async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        message: req.body.message
    })
    await comment.save();
    req.flash('success', 'Comment has been submited')
    res.redirect('/');
}))
//error handler
app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    // const { statusCode = 500, message = 'something went wrong' } = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
    console.log("Listining");
})