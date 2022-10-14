const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to Recipe Website');
            res.redirect('/');
        })
    } catch (e) {
        res.redirect('register');
    }
}));
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout', (req, res) => {
    // req.logout();
    // req.flash('success', "Goodbye!")
    // res.redirect('/');
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
            res.send('Error')
        } else {
            //req.flash('success', "Goodbye!")
            res.redirect('/')
        }
    })
})
module.exports = router;