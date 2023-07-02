const { body } = require('express-validator');

const registerValidationSchema = [
    body('username', 'Username cannot be empty').exists().notEmpty(),
    body('email', 'You must provide a correct email address').exists().isEmail(),
    body('password', 'Password cannot be empty').exists().notEmpty(),
    // Logic to check if password and confirmation are different
    // https://stackoverflow.com/questions/12548624/validate-a-password-with-express-validator
    body('confirm_password')
        .exists({ checkFalsy: true })
        .withMessage('Password confirmation cannot be empty')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('The passwords do not match'),
];

module.exports = registerValidationSchema;
