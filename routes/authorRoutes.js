const express = require('express');
const moment = require('moment');
const assert = require('assert');
const validate = require('../middleware/validate');
const checkNotLoggedIn = require('../middleware/checkNotLoggedIn');
const checkRole = require('../middleware/checkRole');
const bcrypt = require('bcrypt');

const insertionValidationSchema = require('../schemas/insertionValidationSchema');
const updateValidationSchema = require('../schemas/updateValidationSchema');
const updateSettingsValidationSchema = require('../schemas/updateSettingsValidationSchema');
const { body } = require('express-validator');
const changePasswordValidationSchema = require('../schemas/changePasswordValidationSchema');

const router = express.Router();

router.get('/', checkNotLoggedIn, checkRole, (req, res, next) => {
    let query = 'SELECT * FROM Articles';
    let query2 = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(query, function (errorArticles, rows) {
        db.all(query2, function (errBlog, settingsRow) {
            if (errorArticles) {
                next(errorArticles);
            }
            if (errBlog) {
                next(errBlog);
            } else {
                res.render('authorDashboard.ejs', { rows, settingsRow });
            }
        });
    });
});

router.get('/article/create-article', (req, res, next) => {
    res.render('createArticle.ejs');
});

router.put('/article/:id', (req, res, next) => {
    let query =
        'UPDATE Articles SET publish_state = "Published", publish_date = ? WHERE article_id = ?';
    let articletoUpdate = req.params.id;
    let date = moment().format('MMMM Do YYYY, h:mm a');

    db.all(query, [date, articletoUpdate], function (err, rows) {
        if (err) {
            next(err);
        } else {
            res.redirect('/dashboard/');
        }
    });
});

router.post(
    '/article/create-article',
    insertionValidationSchema,
    validate,
    (req, res, next) => {
        let query = `INSERT INTO Articles ("title", "subtitle", "contents", "user_id", "likes_count",
             "created_at_date", "modified_at_date", "publish_state")
             VALUES (?,?,?,?,?,?,?,?)`;
        let date = moment().format('MMMM Do YYYY, h:mm a');

        let values = [
            req.body.title,
            req.body.subtitle,
            req.body.contents,
            1,
            0,
            date,
            date,
            'Draft',
        ];

        db.all(query, values, function (err, rows) {
            if (err) {
                next(err);
            } else {
                req.flash('success', 'Draft created successfully!');
                res.redirect('/dashboard');
            }
        });
    }
);

router.get('/article/edit-article/:id', (req, res, next) => {
    let query = 'SELECT * FROM Articles WHERE article_id = ?';
    let id = req.params.id;
    db.all(query, [id], function (err, rows) {
        if (err) {
            next(err);
        } else {
            res.render('editArticle.ejs', { rows });
        }
    });
});

router.put(
    '/article/edit-article/:id',
    updateValidationSchema,
    validate,
    (req, res, next) => {
        let query =
            'UPDATE Articles SET title = ?, subtitle = ?, contents= ?, modified_at_date = ? WHERE article_id = ?';
        let secondQuery = 'SELECT * FROM Articles WHERE article_id = ?';
        let articletoUpdate = req.params.id;
        let { title, subtitle, contents } = req.body;
        let date = moment().format('MMMM Do YYYY, h:mm a');
        db.all(
            query,
            [title, subtitle, contents, date, articletoUpdate],
            function (err, rows) {
                db.all(
                    secondQuery,
                    [articletoUpdate],
                    function (errorArticle, articleRow) {
                        if (err) {
                            next(err);
                        }
                        if (errorArticle) {
                            next(errorArticle);
                        } else {
                            req.flash('success', 'Article successfully updated!');
                            res.render('editArticle.ejs', { rows: articleRow });
                        }
                    }
                );
            }
        );
    }
);

router.delete('/article/:id', (req, res, next) => {
    let query = 'DELETE FROM Articles WHERE article_id = ?';
    let articleToDelete = req.params.id;

    db.all(query, [articleToDelete], function (err, rows) {
        if (err) {
            next(err);
        } else {
            res.redirect('/dashboard');
        }
    });
});

router.get('/settings', (req, res, next) => {
    let query = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(query, function (err, rows) {
        if (err) {
            next(err);
        } else {
            res.render('blogSettings.ejs', { rows });
        }
    });
});

router.post(
    '/settings',
    updateSettingsValidationSchema,
    validate,
    (req, res, next) => {
        let query = `UPDATE BlogSettings SET blog_title = ?, blog_subtitle = ?;`;
        let secondQuery = `UPDATE Users SET user_name = ?`;

        let { blog_title, blog_subtitle, user_name } = req.body;
        db.all(
            query,
            [blog_title, blog_subtitle],
            function (errBlogSettings, rowBlogSettings) {
                db.all(secondQuery, [user_name], function (errAuthor, authorRow) {
                    if (errBlogSettings) {
                        next(errBlogSettings);
                    }
                    if (errAuthor) {
                        next(errAuthor);
                    } else {
                        res.redirect('/dashboard');
                    }
                });
            }
        );
    }
);

router.get('/change_password', (req, res, next) => {
    res.render('changePassword.ejs');
});

router.post(
    '/change_password',
    changePasswordValidationSchema,
    validate,
    async (req, res, next) => {
        let { old_password, new_password, confirm_new_password } = req.body;
        let errors, hashedPassword;
        let query = `SELECT * FROM Users WHERE user_id = ?`;
        let secondQuery = `UPDATE Users SET user_password = ? WHERE user_id = ?`;
        let { user_password, user_id } = req.user;
        if (res.locals.result) {
            errors = res.locals.result.errors;
            return res.render('changePassword.ejs', { errors });
        }

        db.all(query, [user_id], async function (err, rows) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                if (rows.length > 0) {
                    const isMatch = await bcrypt.compare(
                        old_password,
                        user_password
                    );
                    if (isMatch || old_password === user_password) {
                        hashedPassword = await bcrypt.hash(new_password, 10);
                        db.all(
                            secondQuery,
                            [hashedPassword, user_id],
                            async function (err, rows) {
                                if (err) {
                                    console.log(err)
                                    next(err);
                                } else {
                                    req.flash(
                                        'success_msg',
                                        'Password successfully changed!'
                                    );
                                    res.redirect('/dashboard/change_password');
                                }
                            }
                        );
                    } else {
                        req.flash('failure_msg', 'Current Password is wrong');
                        res.redirect('/dashboard/change_password');
                    }
                } else {
                    req.flash('failure_msg', 'No user found!');
                    res.redirect('/dashboard/change_password');
                }
            }
        });
    }
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
