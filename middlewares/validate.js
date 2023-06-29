const Joi = require('joi');
const validateInsertion = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);
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

const validateUpdate = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);
        // If there is no validation error, proceed to the next step
        if (!result.error) {
            next();
            // If there is an error, re-render the article creation page and display the error.
        } else {
            const { details } = result.error;
            res.render('editArticle.ejs', { details });
        }
    };
};
module.exports = { validateInsertion, validateUpdate };
