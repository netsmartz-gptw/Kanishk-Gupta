const { ErrorHandler } = require("../helpers/errorHandler");
const { ChoresHistory } = require("../models")
const { MARK_CHORE_PAID } = require('../config/messages');
const { jsonResponse } = require("../helpers");

/**
 *  Mark chores as paid
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const markChoresAsPaid = async (req, res, next) => {

	try {
		
		const choreIds = req.body.choreIds
		const paidChores = await ChoresHistory.updateMany({ choreId: { $in: choreIds }, isApproved: true }, { isPaid: true, paidOn: new Date() }).exec();

		// send the ok response
		return jsonResponse(res, 200, MARK_CHORE_PAID)
	}
	catch (error) {
		return next(new ErrorHandler(500, null, null, error))
	}
}

module.exports = markChoresAsPaid