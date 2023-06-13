const { ChoresHistory } = require("../models");

/**
 * Fetch approaved and unpaid chores sum total for a user
 * 
 * @param {String} childUid 
 */
const fetchUnpaidChoresHistory = async (childUid) => {
	try {
		const chores = await ChoresHistory.find({
			isApproved: true,
			isPaid: false,
			uid: childUid,
		}).exec();

		return chores;
	}
	catch (error) {
		throw error
	}
}

module.exports = fetchUnpaidChoresHistory;