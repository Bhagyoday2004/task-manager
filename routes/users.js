const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
    const user = new User({ username: req.body.username, password: req.body.password });
    await user.save();
    res.redirect('/users/login');
});

router.get('/login', (req, res) => res.render('login', { message: req.flash('error') }));
router.post('/login', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }),
    (req, res) => res.redirect('/tasks'));

router.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

module.exports = router;
