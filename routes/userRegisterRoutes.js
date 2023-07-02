const express = require('express');
const router = express.Router();
const assert = require('assert');
const bcrypt = require('bcrypt');
const checkUserAuth = require('../middleware/checkLoggedIn');
const registerValidationSchema = require('../controllers/registerValidationSchema');
const validate = require('../middleware/validate');

router.get('/', checkUserAuth, (req, res, next) => {
    res.render('register.ejs');
});

router.post('/', registerValidationSchema, validate, async (req, res, next) => {
    let { username, email, password } = req.body;
    let userRole = 'Reader';
    let query = `INSERT INTO Users ("user_name", "user_email", "user_password", "user_role")
                 VALUES(?,?,?,?)
    `;
    let secondQuery = `SELECT * FROM Users WHERE user_email = ?`;
    // handle errors if any are sent via the validate middleware function
    let errors, hashedPassword;
    if (res.locals.result) {
        errors = res.locals.result.errors;
        res.render('register.ejs', { errors });
    }
    if (typeof password !== 'undefined') {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    db.all(secondQuery, [email], function (err, rows) {
        if (err) {
            next(err);
        } else {
            // There are users already in the DB with this email
            if (rows.length > 0) {
                req.flash('failure_msg', 'Email already registered.');
                res.redirect('/register');
            }
        }
    });

    db.all(query, [username, email, hashedPassword, userRole], function (err, rows) {
        if (err) {
            next(err);
        } else {
            req.flash('success_msg', 'You successfully registered!');
            res.redirect('/login');
        }
    });
});

module.exports = router;
