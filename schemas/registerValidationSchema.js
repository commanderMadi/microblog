const { body } = require('express-validator');

const registerValidationSchema = [
    body('username', 'Username minimum length is 3 and maximum is 20').exists().isLength({ min: 5, max: 20 }),
    body('email', 'You must provide a correct email address').exists().isEmail(),
    body('password', 'Password minimum length is 6.').exists().isLength({ min: 6, max: undefined }),
    // Logic to check if password and confirmation are different
    // https://stackoverflow.com/questions/12548624/validate-a-password-with-express-validator
    body('confirm_password')
        .exists({ checkFalsy: true })
        .withMessage('Password confirmation must be the same length as the password.')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('The passwords you entered do not match.'),
];

module.exports = registerValidationSchema;
