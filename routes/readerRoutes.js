const express = require('express');
const router = express.Router();
const assert = require('assert');
const moment = require('moment');
// const checkNotLoggedIn = require('../middleware/checkNotLoggedIn');

router.get('/', (req, res, next) => {
    let query = 'SELECT * FROM Articles WHERE publish_state = "Published" ORDER BY publish_date DESC';
    let secondQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;

    db.all(query, function (errorArticles, rows) {
        db.all(secondQuery, function (errBlog, settingsRow) {
            let authorFirstTimeLogin;
            if (errorArticles) {
                next(errorArticles);
            }
            if (errBlog) {
                next(errBlog);
            } else {
                if (req.user && req.user.user_role === 'Author') {
                    let { user_password } = req.user;
                    authorFirstTimeLogin = user_password === process.env.FIRST_TIME_LOGIN_PASSWORD || user_password === 'admintest123';
                }
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

router.get('/article/:id', (req, res, next) => {
    let query = 'SELECT * FROM Articles WHERE article_id = ? ;';
    let secondQuery = 'SELECT * FROM Comments WHERE article_id = ?';
    let thirdQuery = 'SELECT * FROM Likes WHERE article_id = ?';
    let fourthQuery = `SELECT BlogSettings.user_id, Users.user_name, 
                  BlogSettings.blog_title, BlogSettings.blog_subtitle FROM BlogSettings
                  INNER JOIN Users ON BlogSettings.user_id=Users.user_id;`;
    let articleID = req.params.id;
    db.all(query, [articleID], function (err, rows) {
        db.all(secondQuery, [articleID], function (commentsErr, commentsRows) {
            db.all(thirdQuery, [articleID], function (likesError, likesRows) {
                db.all(fourthQuery, function (settingsError, settingsRow) {
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
            commentsCount = rows.length;
            res.send({ comment, commentAuthor, commentsCount, commentDate: date });
        }
    });
});

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
        case 'Like':
            likesCountAfterInteraction++;
            db.all(insertQuery, [userID, articleID], function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    res.send({
                        numericLikeCount: likesCountAfterInteraction,
                    });
                }
            });
            break;
        case 'Unlike':
            likesCountAfterInteraction--;
            db.all(deleteQuery, [userID], function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    res.send({
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
