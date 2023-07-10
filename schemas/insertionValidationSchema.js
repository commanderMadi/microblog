const { body } = require('express-validator');

const insertionValidationSchema = [
    body('title', 'Article title minimum length is 5 and maximum is 50.').exists().isLength({ min: 5, max: 50 }),
    body('subtitle', 'Article subtitle minimum length is 5 and maximum is 80.').exists().isLength({ min: 5, max: 80 }),
    body('contents', 'Article content minimum length is 3').exists().isLength({ min: 5, max: undefined }),
];

module.exports = insertionValidationSchema;
