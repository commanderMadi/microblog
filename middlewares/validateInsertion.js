const Joi = require('joi');
const validateInsertion = (schema, objToValidate) => {
    return (req, res, next) => {
        const result = schema.validate(req.body, objToValidate);
        // If there is no validation error, proceed to the next step
        if (!result.error) {
            next();
            // If there is an error, re-render the article creation page and display the error.
        } else {
            const { details } = result.error;
            res.render('createArticle.ejs', { details });
        }
    };
};
module.exports = validateInsertion;
