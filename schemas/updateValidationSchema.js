// Require 3rd party dependencies
const { body } = require('express-validator');

// article editing validation schema
// all fields must not be empty
// fields have a min and max length except for the article body (contents)
const updateSettingsValidationSchema = [
    body('title', 'Article title minimum length is 5 and maximum is 50.')
        .exists()
        .isLength({ min: 5, max: 50 }),
    body('subtitle', 'Article title minimum length is 5 and maximum is 50.')
        .exists()
        .isLength({ min: 5, max: 50 }),
    body('contents', 'Article content minimum length is 3')
        .exists()
        .isLength({ min: 3, max: undefined }),
];

// export the schema
module.exports = updateSettingsValidationSchema;
