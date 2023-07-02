const express = require('express');
const moment = require('moment');
const assert = require('assert');
const validate = require('../middleware/validate');
const checkNoAuth = require('../middleware/checkNoAuth');

const insertionValidationSchema = require('../controllers/insertionValidationSchema');
const updateValidationSchema = require('../controllers/updateValidationSchema');
const updateSettingsValidationSchema = require('../controllers/updateSettingsValidationSchema');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', checkNoAuth, (req, res, next) => {
    let query = 'SELECT * FROM Articles';
    let query2 = `SELECT BlogSettings.author_id, Authors.author_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Authors ON BlogSettings.author_id=Authors.author_id;`;

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
    let date = moment().format('MMMM Do YYYY, h:mm:ss a');

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
        let query = `INSERT INTO Articles ("title", "subtitle", "contents", "author_id", "likes",
             "created_at_date", "modified_at_date", "publish_state")
             VALUES (?,?,?,?,?,?,?,?)`;
        let date = moment().format('MMMM Do YYYY, h:mm:ss a');

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
        let date = moment().format('MMMM Do YYYY, h:mm:ss a');
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
            console.log(err);
            next(err);
        } else {
            res.redirect('/dashboard');
        }
    });
});

router.get('/settings', (req, res, next) => {
    let query = `SELECT BlogSettings.author_id, Authors.author_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Authors ON BlogSettings.author_id=Authors.author_id;`;

    db.all(query, function (err, rows) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log(rows);
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
        let secondQuery = `UPDATE Authors SET author_name = ?`;

        let { blog_title, blog_subtitle, author_name } = req.body;
        db.all(
            query,
            [blog_title, blog_subtitle],
            function (errBlogSettings, rowBlogSettings) {
                db.all(secondQuery, [author_name], function (errAuthor, authorRow) {
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
