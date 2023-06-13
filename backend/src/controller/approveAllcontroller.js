const { getChildsUidsByParentUids } = require("../helpers/choreHelpers")
const { ErrorHandler } = require("../helpers/errorHandler");
const ChoresHistory = require("../models/choresHistoryModal")
const {	ALL_PENDING_CHORE_APPROVED, NO_CHILD_FOUND } = require('../config/messages');
const { jsonResponse } = require("../helpers");

/**
 * Approve the chrore transactions of the week as per the chore IDs
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const approveAllChoreController = async (req, res, next) => {
	const uid = req.body.uid
	try {

		// fetch all childs of current parent by uid
		const childUids = await getChildsUidsByParentUids(uid)
		if(!childUids) return jsonResponse(res, 400, NO_CHILD_FOUND)

		// update all chore childs who have pending approval(isApproved === false)
		await ChoresHistory.updateMany({ uid: { $in: childUids }, isApproved: false }, { isApproved: true }).exec();

		// return response
		return jsonResponse(res, 200, ALL_PENDING_CHORE_APPROVED)
	}
	catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}
}

module.exports = approveAllChoreController;