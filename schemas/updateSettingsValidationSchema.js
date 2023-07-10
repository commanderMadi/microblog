const { body } = require('express-validator');

const updateValidationSchema = [
    body('blog_title', 'Blog title minimum length is 3 and maximum is 25.').exists().isLength({ min: 2, max: 25 }),
    body('blog_subtitle', 'Blog subtitle minimum length is 3 and maximum is 100.').exists().isLength({ min: 2, max: 100 }),
    body('user_name', 'Author name minimum length is 2 and maximum is 25.').exists().isLength({ min: 2, max: 25 }),
];

module.exports = updateValidationSchema;
