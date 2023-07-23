// Require 3rd party dependencies
const express = require('express');
const moment = require('moment');
const assert = require('assert');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');

// custom middleware
const validate = require('../middleware/validate');
const checkNotLoggedIn = require('../middleware/checkNotLoggedIn');
const checkRole = require('../middleware/checkRole');

// Custom validation schemas
const insertionValidationSchema = require('../schemas/insertionValidationSchema');
const updateValidationSchema = require('../schemas/updateValidationSchema');

// initialize express router
const router = express.Router();

/**
 * @desc Render the dashboard page
 * Passing in the custom middleware checkNotLoggedIn to ensure if the author is authenticated
 * Passing in the custom middleware checkRole to ensure that the user trying to access the dashboard is an author
 */
router.get('/', checkNotLoggedIn, checkRole, (req, res, next) => {
    let getAllArticlesQuery = 'SELECT * FROM Articles';
    // load the settings needed for displaying the blog settings in the navbar partial
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(getAllArticlesQuery, function (errorArticles, rows) {
        db.all(getAllBlogSettingsQuery, function (errBlog, settingsRow) {
            if (errorArticles) {
                next(errorArticles);
            }
            if (errBlog) {
                next(errBlog);
            } else {
                // render the dashboard view on successful db call
                res.render('authorDashboard.ejs', { req, rows, settingsRow });
            }
        });
    });
});

/**
 * @desc Render the create article page
 */
router.get('/article/create-article', (req, res, next) => {
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(getAllBlogSettingsQuery, function (err, settingsRow) {
        if (err) {
            next(err);
        } else {
            // render the create article view on successful db call
            res.render('createArticle.ejs', { req, settingsRow });
        }
    });
});

/**
 * @desc Update the article status from Draft to Published
 */
router.put('/article/:id', (req, res, next) => {
    let updateQuery =
        'UPDATE Articles SET publish_state = "Published", publish_date = ? WHERE article_id = ?';
    let articletoUpdate = req.params.id;
    // Use the momentjs library to obtain the date in a specific format
    let date = moment().format('MMMM Do YYYY, h:mm a');

    db.all(updateQuery, [date, articletoUpdate], function (err, rows) {
        if (err) {
            next(err);
        } else {
            // redirect the author back to the dashboard when an article is updated
            res.redirect('/dashboard/');
        }
    });
});

/**
 * @desc Insert a draft article when created to the database
 */
router.post(
    '/article/create-article',
    insertionValidationSchema,
    validate,
    (req, res, next) => {
        let insertQuery = `INSERT INTO Articles ("title", "subtitle", "contents", "user_id", "likes_count",
             "created_at_date", "modified_at_date", "publish_state")
             VALUES (?,?,?,?,?,?,?,?)`;
        let date = moment().format('MMMM Do YYYY, h:mm a');
        let values = [
            req.body.title,
            req.body.subtitle,
            req.body.contents,
            req.user.user_id,
            0,
            date,
            date,
            'Draft',
        ];

        db.all(insertQuery, values, function (err, rows) {
            if (err) {
                next(err);
            } else {
                // A flash message that will be rendered on the dashboard page after a draft is successfully created
                req.flash('success', 'Draft created successfully!');

                // redirect the author back to the dashboard when a draft is successfully created
                res.redirect('/dashboard');
            }
        });
    }
);

/**
 * @desc Render an article with its current contents in the edit page
 */
router.get('/article/edit-article/:id', (req, res, next) => {
    let selectQuery = 'SELECT * FROM Articles WHERE article_id = ?';
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;
    let id = req.params.id;
    let blogSettings = '';

    db.all(getAllBlogSettingsQuery, function (err, settingsRow) {
        blogSettings = settingsRow;
    });
    db.get(selectQuery, [id], function (err, articleRow) {
        if (err) {
            next(err);
        } else {
            // Render the edit article view on successful db call
            res.render('editArticle.ejs', {
                settingsRow: blogSettings,
                articleRow,
                req,
            });
        }
    });
});

/**
 * @desc Update the article contents based on the given article ID that is supplied as a request parameter
 * Using the put function to follow the fundamental RESTFUL Api practices
 */
router.put(
    '/article/edit-article/:id',
    updateValidationSchema,
    validate,
    (req, res, next) => {
        let query =
            'UPDATE Articles SET title = ?, subtitle = ?, contents= ?, modified_at_date = ? WHERE article_id = ?';
        let secondQuery = 'SELECT * FROM Articles WHERE article_id = ?';
        let getSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;
        let articletoUpdate = req.params.id;
        let blogSettings = '';
        let { title, subtitle, contents } = req.body;
        let date = moment().format('MMMM Do YYYY, h:mm a');

        db.all(getSettingsQuery, function (err, settingsRow) {
            blogSettings = settingsRow;
        });

        db.all(
            query,
            [title, subtitle, contents, date, articletoUpdate],
            function (err, rows) {
                db.get(
                    secondQuery,
                    [articletoUpdate],
                    function (errorArticle, articleRow) {
                        if (err) {
                            next(err);
                        }
                        if (errorArticle) {
                            next(errorArticle);
                        } else {
                            // A flash message that will be rendered on the edit article page after an article is successfully updated
                            req.flash('success', 'Article successfully updated!');
                            // re-render the edit page after successful db operation
                            res.render('editArticle.ejs', {
                                settingsRow: blogSettings,
                                req,
                                articleRow,
                            });
                        }
                    }
                );
            }
        );
    }
);

/**
 * @desc Delete the article based on the given article ID that is supplied as a request parameter
 * Using the delete function to follow the fundamental RESTFUL Api practices
 */
router.delete('/article/:id', (req, res, next) => {
    let deleteArticleCommentsQuery = 'DELETE FROM Comments WHERE article_id = ?';
    let deleteArticleLikesQuery = 'DELETE FROM Likes WHERE article_id = ?';
    let deleteArticleQuery = 'DELETE FROM Articles WHERE article_id = ?';
    let articleToDelete = req.params.id;

    db.all(deleteArticleCommentsQuery, [articleToDelete], function (err, rows) {
        db.all(
            deleteArticleLikesQuery,
            [articleToDelete],
            function (errQueryTwo, rowsQueryTwo) {
                db.all(
                    deleteArticleQuery,
                    [articleToDelete],
                    function (errQueryThree, rowsQueryThree) {
                        if (err) {
                            next(err);
                        }
                        if (errQueryTwo) {
                            next(errQueryTwo);
                        }
                        if (errQueryThree) {
                            next(errQueryThree);
                        } else {
                            // Redirect to the dashboard on successful db operation
                            res.redirect('/dashboard');
                        }
                    }
                );
            }
        );
    });
});

/**
 * @desc send back the author to the homepage upon logging out
 */
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

// export the router
module.exports = router;
