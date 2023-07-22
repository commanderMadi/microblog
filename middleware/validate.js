// Require 3rd party dependencies
const { validationResult } = require('express-validator');

// a function to validate based on the provided schemas
const validate = (req, res, next) => {
    let result = validationResult(req);
    // If any validation errors arise, the next middleware in the stack will handle them
    if (!result.isEmpty()) {
        next(result);
    } else {
        // call the next middleware in the stack
        next();
    }
};

// export the middleware
module.exports = validate;
