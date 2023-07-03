const { body } = require('express-validator');

const updateValidationSchema = [
    body('blog_title', 'Blog title cannot be empty').exists().notEmpty(),
    body('blog_subtitle', 'Blog subtitle cannot be empty').exists().notEmpty(),
    body('author_name', 'Author name cannot be empty').exists().notEmpty(),
];

module.exports = updateValidationSchema;
