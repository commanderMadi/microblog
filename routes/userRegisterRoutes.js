const express = require('express');
const assert = require('assert');
const bcrypt = require('bcrypt');

// Custom middleware
const checkUserAuth = require('../middleware/checkLoggedIn');
const validate = require('../middleware/validate');

// Custom validation schemas
const registerValidationSchema = require('../schemas/registerValidationSchema');

// Initialize the express router
const router = express.Router();

/**
 * @desc Render the register page
 * Passing in the custom middleware checkUserAuth to check whether the user is authenticated
 * If the user is authenticated, they will be redirected to the home page
 * If not, they can access the register page to create an account
 */
router.get('/', checkUserAuth, (req, res, next) => {
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(getAllBlogSettingsQuery, function (err, settingsRow) {
        if (err) {
            next(err);
        } else {
            // Render the register page upon successful db operation
            res.render('register.ejs', { req, settingsRow });
        }
    });
});

/**
 * @desc insert the registeration details and create a user
 * Passing in the custom validation schema registerValidationSchema to ensure the user follows the specified registration criteria
 */
router.post('/', registerValidationSchema, validate, async (req, res, next) => {
    let { username, email, password } = req.body;
    let userRole = 'Reader';
    let insertUserQuery = `INSERT INTO Users ("user_name", "user_email", "user_password", "user_role")
                 VALUES(?,?,?,?)
    `;
    // handle errors if any are sent via the validate middleware function
    let hashedPassword;

    // hash the user password before sending it to the db
    if (typeof password !== 'undefined') {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    db.all(insertUserQuery, [username, email, hashedPassword, userRole], function (err, rows) {
        if (err) {
            next(err);
        } else {
            req.flash('success_msg', 'You successfully registered! Proceed to login now.');
            res.redirect('/login');
        }
    });
});

// export the router
module.exports = router;
