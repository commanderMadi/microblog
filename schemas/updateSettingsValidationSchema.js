// Require 3rd party dependencies
const { body } = require('express-validator');

// blog settings validation schema
// all fields must not be empty
// fields have a min and max length except for the article body (contents)
const updateValidationSchema = [
    body('blog_title', 'Blog title minimum length is 3 and maximum is 25.').exists().isLength({ min: 2, max: 25 }),
    body('blog_subtitle', 'Blog subtitle minimum length is 3 and maximum is 100.').exists().isLength({ min: 2, max: 100 }),
    body('user_name', 'Author name minimum length is 2 and maximum is 25.').exists().isLength({ min: 2, max: 25 }),
];

// export the schema
module.exports = updateValidationSchema;
