const Joi = require('joi');

const markAscompletedSchema = Joi.object({
    choreid: Joi.string().hex().min(24).required(),
    day: Joi.string().valid('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday').required(),
    completed: Joi.boolean().required(), 
        
})

module.exports = markAscompletedSchema