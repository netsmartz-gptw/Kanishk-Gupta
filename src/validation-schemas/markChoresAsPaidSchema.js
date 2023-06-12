const Joi = require('joi');

const markChoresAsPaidSchema = Joi.object({
    choreIds: Joi.array().required(),
})

module.exports = markChoresAsPaidSchema