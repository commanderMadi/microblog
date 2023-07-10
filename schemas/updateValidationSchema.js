const { body } = require('express-validator');

const updateSettingsValidationSchema = [
    body('title', 'Article title minimum length is 5 and maximum is 50.').exists().isLength({ min: 5, max: 50 }),
    body('subtitle', 'Article title minimum length is 5 and maximum is 50.').exists().isLength({ min: 5, max: 50 }),
    body('contents', 'Article content minimum length is 3').exists().isLength({ min: 3, max: undefined }),
];

module.exports = updateSettingsValidationSchema;
