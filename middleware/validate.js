const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        res.locals.result = result;
        next();
    } else {
        next();
    }
};

module.exports = validate;
