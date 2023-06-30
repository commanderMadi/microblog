const express = require('express');
const moment = require('moment');
const assert = require('assert');
const validateInsertion = require('../middleware/validateInsertion');
const validateEdit = require('../middleware/validateEdit');

const {
    insertionValidationSchema,
} = require('../controllers/insertionValidationSchema');
const { updateValidationSchema } = require('../controllers/updateValidationSchema');
const { body } = require('express-validator');

const router = express.Router();

let date = moment().format('MMMM Do YYYY, h:mm:ss a');

router.get('/dashboard/articles', (req, res, next) => {
    let query = 'SELECT * FROM Articles WHERE publish_state = "Draft"';
    let query2 = 'SELECT * FROM Authors WHERE author_id = "1"';

    db.all(query, function (err, rows) {
        db.all(query2, function (err2, rows2) {
            if (err) {
                next(err);
            }
            if (err2) {
                next(err2);
            } else {
                res.render('authorDashboard.ejs', { rows, rows2 });
            }
        });
    });
});

router.get('/dashboard/articles/create-article', (req, res, next) => {
    res.render('createArticle.ejs');
});

router.post(
    '/dashboard/articles/article/',
    insertionValidationSchema,
    validateInsertion,
    (req, res, next) => {
        let query =
            'INSERT INTO Articles ("title", "subtitle", "contents", "author_id", "likes", "created_at_date", "modified_at_date", "publish_state") VALUES (?,?,?,?,?,?,?,?)';

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
                res.redirect('/author/dashboard/articles');
            }
        });
    }
);

router.get('/dashboard/articles/article/edit-article/:id', (req, res, next) => {
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
    '/dashboard/articles/article/edit-article/:id',
    updateValidationSchema,
    validateEdit,
    (req, res, next) => {
        let query =
            'UPDATE Articles SET title = ?, subtitle = ?, contents= ? WHERE article_id = ?';
        let articletoUpdate = req.params.id;
        let { title, subtitle, contents } = req.body;
        console.log('0--------');
        console.log(req.params);
        console.log('0--------');

        db.all(
            query,
            [title, subtitle, contents, articletoUpdate],
            function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    console.log('lol');
                    res.redirect('/author/dashboard/articles');
                }
            }
        );
    }
);

router.delete('/dashboard/articles/article/:id', (req, res, next) => {
    let query = 'DELETE FROM Articles WHERE article_id = ?';
    let articleToDelete = req.params.id;

    db.all(query, [articleToDelete], function (err, rows) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('lol');
            res.redirect('/author/dashboard/articles');
        }
    });
});

module.exports = router;
