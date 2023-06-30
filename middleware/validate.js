const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        next(result.errors);
    } else {
        next();
    }
};

module.exports = validate;
