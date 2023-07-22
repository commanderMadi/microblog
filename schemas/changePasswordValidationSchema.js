// Require 3rd party dependencies
const { body } = require('express-validator');

// Password change validation schema
// passwords (old and new) must not be empty
// new password and its confirmation must match
const changePasswordValidationSchema = [
    body('old_password', 'Old password cannot be empty').exists().notEmpty(),
    body('new_password', 'New Password cannot be empty').exists().notEmpty(),
    // Logic to check if password and confirmation are different
    // https://stackoverflow.com/questions/12548624/validate-a-password-with-express-validator
    body('confirm_new_password')
        .exists({ checkFalsy: true })
        .withMessage('New Password confirmation cannot be empty')
        .custom((value, { req }) => value === req.body.new_password)
        .withMessage('The new passwords do not match'),
];

// export the schema
module.exports = changePasswordValidationSchema;
