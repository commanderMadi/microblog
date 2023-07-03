const { body } = require('express-validator');

const changePasswordValidationSchema = [
    body('old_password', 'Old password cannot be empty').exists().notEmpty(),
    body('new_password', 'New Password cannot be empty').exists().notEmpty(),
    body('confirm_new_password')
        .exists({ checkFalsy: true })
        .withMessage('New Password confirmation cannot be empty')
        .custom((value, { req }) => value === req.body.new_password)
        .withMessage('The new passwords do not match'),
];

module.exports = changePasswordValidationSchema;
