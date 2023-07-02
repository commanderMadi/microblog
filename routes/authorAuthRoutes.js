const express = require('express');
const moment = require('moment');
const assert = require('assert');
const passport = require('passport');
const checkAuthorAuth = require('../middleware/checkAuthorAuth');

const router = express.Router();

router.get('/', checkAuthorAuth, (req, res, next) => {
    res.render('authorLogin.ejs', { title: 'Author Login' });
});

router.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/dashboard/',
        failureRedirect: '/dashboard/login',
        failureFlash: true,
    })
);

module.exports = router;
