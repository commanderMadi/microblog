const express = require('express');
const router = express.Router();
const assert = require('assert');
// const checkNotLoggedIn = require('../middleware/checkNotLoggedIn');

router.get('/', (req, res, next) => {
    let query =
        'SELECT * FROM Articles WHERE publish_state = "Published" ORDER BY publish_date DESC';
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
                res.render('index.ejs', {
                    message:
                        'First time login password is very unsecure. Proceed to change the password ASAP',
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
    let articleID = req.params.id;
    db.all(query, [articleID], function (err, rows) {
        db.all(secondQuery, [articleID], function (commentsErr, commentsRows) {
            db.all(thirdQuery, [articleID], function (likesError, likesRows) {
                if (err) {
                    next(err);
                }
                if (commentsErr) {
                    next(commentsErr);
                }
                if (likesError) {
                    next(likesError);
                } else {
                    console.log(likesRows);
                    res.render('article.ejs', {
                        req,
                        rows,
                        likesRows,
                        commentsRows,
                    });
                }
            });
        });
    });
});

router.post('/article', (req, res, next) => {
    let query = `INSERT INTO Comments ("article_id", "comment_text", "comment_author", "user_id")
                VALUES (?,?,?,?)`;
    let { comment, id } = req.body;
    let commentAuthor = req.user.user_name;
    let userID = req.user.user_id;

    db.get(query, [id, comment, commentAuthor, userID], function (err, row) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/article/${id}`);
        }
    });
});

router.post('/article/interact', (req, res, next) => {
    let query = `INSERT INTO Likes ("user_id", "article_id")
                VALUES (?,?)`;
    let secondQuery = `UPDATE Articles SET "likes_count" = ? WHERE article_id = ?`;
    let { articleID, likesCount } = req.body;
    let userID = req.user.user_id;
    let numericID = parseInt(articleID);
    let numericLikeCount = parseInt(likesCount);
    numericLikeCount++;

    db.all(query, [userID, numericID], function (err, row) {
        db.all(
            secondQuery,
            [numericLikeCount, numericID],
            function (errTwo, rowsTwo) {
                if (err) {
                    next(err);
                }
                if (errTwo) {
                    next(errTwo);
                } else {
                    res.redirect(`/article/${articleID}`);
                }
            }
        );
    });
});

router.post('/article/remove_interaction', (req, res, next) => {
    let query = `DELETE FROM Likes WHERE "user_id" = ?`;
    let secondQuery = `UPDATE Articles SET "likes_count" = ? WHERE article_id = ?`;
    let { articleID, likesCount } = req.body;
    let userID = req.user.user_id;
    let numericLikeCount = parseInt(likesCount);
    numericLikeCount--;

    db.all(query, [userID], function (err, row) {
        if (parseInt(likesCount) > 0) {
            db.all(
                secondQuery,
                [numericLikeCount, articleID],
                function (errTwo, rowsTwo) {
                    if (err) {
                        next(err);
                    }
                    if (errTwo) {
                        next(errTwo);
                    } else {
                        res.redirect(`/article/${articleID}`);
                    }
                }
            );
        } else {
            res.redirect(`/article/${articleID}`);
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
