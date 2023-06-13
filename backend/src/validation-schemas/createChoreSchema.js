const Joi = require('joi');

const createChoreSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().allow('').optional(),
	data: Joi.array().items({
		uid: Joi.string().required(),
		choreType: Joi.string().required().valid('weekly', 'asNeeded'),
		days: Joi.alternatives().conditional('choreType', {
			is: "weekly",
			then: Joi.array().min(1).items(Joi.string().valid('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')).required(),
			otherwise: Joi.optional()
		}),
		autoApprove: Joi.boolean().required(),
		amount: Joi.string().required(),
		assign: Joi.boolean().optional(),
	}).required(),
});

module.exports = createChoreSchema