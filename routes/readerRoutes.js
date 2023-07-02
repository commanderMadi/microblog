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
                res.render('index.ejs', { rows, settingsRow, req });
            }
        });
    });
});

router.get('/article/:id', (req, res, next) => {
    let query = 'SELECT * FROM Articles WHERE article_id = ? ;';
    let secondQuery = 'SELECT * FROM Comments WHERE article_id = ?';
    let id = req.params.id;
    db.get(query, [id], function (err, row) {
        db.all(secondQuery, [id], function (commentsErr, commentsRows) {
            if (err) {
                next(err);
            }
            if (commentsErr) {
                next(commentsErr);
            } else {
                res.render('article.ejs', { req, row, commentsRows });
            }
        });
    });
});

router.post('/article', (req, res, next) => {
    let query = `INSERT INTO Comments ("article_id", "comment_text", "comment_author", "user_id")
                VALUES (?,?,?,?)`;
    let prevPage = req.originalUrl;
    let { comment, id } = req.body;
    let commentAuthor = req.user.user_name;
    let userId = req.user.user_id;
    let numericID = parseInt(id);

    db.get(query, [numericID, comment, commentAuthor, userId], function (err, row) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/article/${id}`);
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
