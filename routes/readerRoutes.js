const express = require('express');
const router = express.Router();
const assert = require('assert');

router.get('/', (req, res, next) => {
    let query =
        'SELECT * FROM Articles WHERE publish_state = "Published" ORDER BY publish_date DESC';
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
                res.render('index.ejs', { rows, settingsRow });
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
                console.log(commentsRows);
                res.render('article.ejs', { row, commentsRows });
            }
        });
    });
});

router.post('/article', (req, res, next) => {
    let query = `INSERT INTO Comments ("article_id", "comment_text")
                VALUES (?,?)`;
    let { comment, id } = req.body;
    let numericID = parseInt(id);
    db.get(query, [numericID, comment], function (err, row) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/article/${id}`);
        }
    });
});

module.exports = router;
