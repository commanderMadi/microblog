const express = require('express');
const router = express.Router();
const assert = require('assert');
const bcrypt = require('bcrypt');
const checkUserAuth = require('../middleware/checkLoggedIn');
const registerValidationSchema = require('../schemas/registerValidationSchema');
const validate = require('../middleware/validate');

router.get('/', checkUserAuth, (req, res, next) => {
    let query = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(query, function (err, settingsRow) {
        if (err) {
            next(err);
        } else {
            res.render('register.ejs', { req, settingsRow });
        }
    });
});

router.post('/', registerValidationSchema, validate, async (req, res, next) => {
    let { username, email, password } = req.body;
    let userRole = 'Reader';
    let query = `SELECT * FROM Users WHERE user_email = ?`;

    let secondQuery = `INSERT INTO Users ("user_name", "user_email", "user_password", "user_role")
                 VALUES(?,?,?,?)
    `;
    // handle errors if any are sent via the validate middleware function
    let hashedPassword;

    if (typeof password !== 'undefined') {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    db.all(query, [email], function (err, rows) {
        if (err) {
            console.log('there is an error');
            next(err);
        } else {
            // There are users already in the DB with this email
            if (rows.length > 0) {
                req.flash('failure_msg', 'Email already registered. Login instead or try with a different email.');
                res.redirect('/register');
            }
        }
    });

    db.all(secondQuery, [username, email, hashedPassword, userRole], function (err, rows) {
        if (err) {
            next(err);
        } else {
            req.flash('success_msg', 'You successfully registered! Proceed to login now.');
            res.redirect('/login');
        }
    });
});

module.exports = router;
