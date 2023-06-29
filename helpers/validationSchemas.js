const Joi = require('joi');
const validationSchemas = {
    article: Joi.object().keys({
        title: Joi.string().required(),
        subtitle: Joi.string().required(),
        contents: Joi.string().required(),
    }),
};
module.exports = validationSchemas;
