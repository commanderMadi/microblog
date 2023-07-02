const express = require('express');
const router = express.Router();
const assert = require('assert');
const passport = require('passport');
const checkUserAuth = require('../middleware/checkLoggedIn');

router.get('/', checkUserAuth, (req, res, next) => {
    res.render('login.ejs');
});

router.post(
    '/',
    passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

module.exports = router;
