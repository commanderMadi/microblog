const { body } = require('express-validator');

exports.insertionValidationSchema = [
    body('title', 'title must be poulated').exists().notEmpty(),
    body('subtitle', 'subtitle must be populated').exists().notEmpty(),
    body('contents', 'contents must be populated').exists(),
];
