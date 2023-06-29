const Joi = require('joi');
const validationSchemas = {
    createArticle: Joi.object().keys({
        title: Joi.string().required(),
        subtitle: Joi.string().required(),
        contents: Joi.string().required(),
    }),
    updateArticle: Joi.object()
        .keys({
            title: Joi.string().required(),
            subtitle: Joi.string().required(),
            contents: Joi.string().required(),
        })
        .unknown(true),
};
module.exports = validationSchemas;
