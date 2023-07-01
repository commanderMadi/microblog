const express = require('express');
const moment = require('moment');
const assert = require('assert');
const passport = require('passport');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', checkAuth, (req, res, next) => {
    res.render('authorLogin.ejs', { title: 'Author Login' });
});

router.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/dashboard/',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

module.exports = router;
