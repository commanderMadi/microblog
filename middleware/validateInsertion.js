const { body, validationResult } = require('express-validator');

const validateInsertion = (req, res, next) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        next(result.errors);
    } else {
        next();
    }
};

module.exports = validateInsertion;
