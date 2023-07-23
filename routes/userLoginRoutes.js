// Require 3rd party dependencies
const express = require('express');
const assert = require('assert');
const passport = require('passport');

// Custom middleware
const checkLoggedIn = require('../middleware/checkLoggedIn');

// Initialize express router
const router = express.Router();

/**
 * @desc Render the login page
 * Passing in the custom middleware checkLoggedIn to check whether the user is authenticated
 * If the user is not authenticated, they will be redirected to the login page
 * Authentication is needed to add comments or likes as a user or to login to the dashboard as an author
 */
router.get('/', checkLoggedIn, (req, res, next) => {
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(getAllBlogSettingsQuery, function (err, settingsRow) {
        if (err) {
            next(err);
        } else {
            // Render the login page upon successful db operation
            res.render('login.ejs', { req, settingsRow });
        }
    });
});

/**
 * @desc Passport library authentication
 * Using the local strategy to authenticate the user
 * If authenticated, they will be redirected to the homepage
 * Else, they will be redirected to the login page
 * A logged in user trying to access the login page will be redirected to the homepage
 */
router.post(
    '/',
    passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

// export the router
module.exports = router;
