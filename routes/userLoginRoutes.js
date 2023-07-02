const express = require('express');
const router = express.Router();
const assert = require('assert');
const passport = require('passport');
const checkUserAuth = require('../middleware/checkUserAuth');

router.get('/', checkUserAuth, (req, res, next) => {
    console.log(req);
    res.render('login.ejs');
});

router.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

module.exports = router;
