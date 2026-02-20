const Joi = require('joi');

exports.createSnipprtSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().allow(''),
    code: Joi.string().required(),
    language: Joi.string().required(),
    visibility: Joi.string().valid('public', 'private'),
    tags: Joi.string().allow('')
})