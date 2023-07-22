// Require 3rd party dependencies
const express = require('express');
const assert = require('assert');
const moment = require('moment');

// Initialize express router
const router = express.Router();

/**
 * @desc Render the main homepage
 */
router.get('/', (req, res, next) => {
    let getPublishedArticlesQuery = 'SELECT * FROM Articles WHERE publish_state = "Published" ORDER BY publish_date DESC';
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(getPublishedArticlesQuery, function (errorArticles, rows) {
        db.all(getAllBlogSettingsQuery, function (errBlog, settingsRow) {
            let authorFirstTimeLogin;
            if (errorArticles) {
                next(errorArticles);
            }
            if (errBlog) {
                next(errBlog);
            } else {
                // Display a change password notification if the author logs in for the first time
                if (req.user && req.user.user_role === 'Author') {
                    let { user_password } = req.user;
                    authorFirstTimeLogin = user_password === process.env.FIRST_TIME_LOGIN_PASSWORD || user_password === 'admintest123';
                }
                // Render the homepage on successful db operation
                res.render('index.ejs', {
                    authorFirstTimeLogin,
                    rows,
                    settingsRow,
                    req,
                });
            }
        });
    });
});

/**
 * @desc Render the individual article page, based on the article ID supplies as a request parameter
 */
router.get('/article/:id', (req, res, next) => {
    let getArticleQuery = 'SELECT * FROM Articles WHERE article_id = ? ;';
    let getArticleCommentsQuery = 'SELECT * FROM Comments WHERE article_id = ?';
    let getArticleLikesQuery = 'SELECT * FROM Likes WHERE article_id = ?';
    let getAllBlogSettingsQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;
    let articleID = req.params.id;
    db.all(getArticleQuery, [articleID], function (err, rows) {
        db.all(getArticleCommentsQuery, [articleID], function (commentsErr, commentsRows) {
            db.all(getArticleLikesQuery, [articleID], function (likesError, likesRows) {
                db.all(getAllBlogSettingsQuery, function (settingsError, settingsRow) {
                    if (err) {
                        next(err);
                    }
                    if (commentsErr) {
                        next(commentsErr);
                    }
                    if (likesError) {
                        next(likesError);
                    }
                    if (settingsError) {
                        next(settingsError);
                    } else {
                        // Render the article view upon successful db operation
                        res.render('article.ejs', {
                            req,
                            rows,
                            likesRows,
                            commentsRows,
                            settingsRow,
                            commentsRows,
                        });
                    }
                });
            });
        });
    });
});

/**
 * @desc Add a comment to a specific article
 */
router.post('/article/comment', (req, res, next) => {
    let insertQuery = `INSERT INTO Comments ("article_id", "comment_text", "comment_author", "comment_date", "user_id")
                VALUES (?,?,?,?, ?)`;
    let selectAllQuery = `SELECT * FROM Comments WHERE article_id = ?`;
    let { comment, articleID } = req.body;
    let commentAuthor = req.user.user_name;
    let userID = req.user.user_id;
    let commentsCount = 0;
    let date = moment().format('MMMM Do YYYY, h:mm a');
    db.all(insertQuery, [articleID, comment, commentAuthor, date, userID], function (err, rows) {
        if (err) {
            next(err);
        }
    });
    db.all(selectAllQuery, [articleID], function (err, rows) {
        if (err) {
            next(err);
        } else {
            // commentsCount will be used to load the number of comments on the frontend using axios (ajax request)
            commentsCount = rows.length;
            // send the data to the client. Axios will use these data to ajax load the comment details upon posting it without a page refresh
            res.send({ comment, commentAuthor, commentsCount, commentDate: date });
        }
    });
});
/**
 * @desc Add a like to a specific article
 */
router.post('/article/interact', (req, res, next) => {
    let updateQuery = `UPDATE Articles SET "likes_count" = ? WHERE article_id = ?`;
    let insertQuery = `INSERT INTO Likes ("user_id", "article_id")
                VALUES (?,?)`;
    let deleteQuery = `DELETE FROM Likes WHERE user_id = ?`;
    let { articleID, likesCount, operation } = req.body;

    let userID = req.user.user_id;
    let numericID = parseInt(articleID);
    let numericLikeCount = parseInt(likesCount);
    let likesCountAfterInteraction = numericLikeCount;

    switch (operation) {
        // If the user pressed like, likes count will increase
        case 'Like':
            likesCountAfterInteraction++;
            db.all(insertQuery, [userID, articleID], function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    // send the data to the client. Axios will use these data to ajax load the total likes count upon posting it without a page refresh
                    res.send({
                        numericLikeCount: likesCountAfterInteraction,
                    });
                }
            });
            break;
        // If the user pressed unlike, likes count will decrease
        case 'Unlike':
            likesCountAfterInteraction--;
            db.all(deleteQuery, [userID], function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    res.send({
                        // send the data to the client. Axios will use these data to ajax load the total likes count upon posting it without a page refresh
                        numericLikeCount: likesCountAfterInteraction,
                    });
                }
            });
            break;
    }
    db.all(updateQuery, [likesCountAfterInteraction, articleID], function (err, rows) {
        if (err) {
            next(err);
        }
    });
});
/**
 * @desc send back the user to the homepage upon logging out
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
