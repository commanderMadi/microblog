const express = require('express');
const router = express.Router();
const assert = require('assert');
const passport = require('passport');
const checkUserAuth = require('../middleware/checkLoggedIn');

router.get('/', checkUserAuth, (req, res, next) => {
    let query = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(query, function (err, settingsRow) {
        if (err) {
            next(err);
        } else {
            res.render('login.ejs', { req, settingsRow });
        }
    });
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
