const { ErrorHandler } = require("../helpers/errorHandler");
const fetchUnpaidChoresHistory = require("../helpers/fetchUnpaidChoresHistoryHelper");

/**
 * Fetch approaved and unpaid chores sum total for a user
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const fetchUnpaidChores = async (req, res, next) => {
	const childUid = req.params.uid

	try {
		const unpaidChores = await fetchUnpaidChoresHistory(childUid)
		// send the ok response 
		return res.status(200).send({
			statusCode: 200,
			response: { unpaidChores }
		})
	} catch (error) {
		return next(new ErrorHandler(500, null, null, error))
	}
}

module.exports = fetchUnpaidChores