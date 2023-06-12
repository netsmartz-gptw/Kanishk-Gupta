const { ErrorHandler } = require("../helpers/errorHandler");
const { ChoresHistory } = require("../models");
const moment = require("moment");
const { getChildrenByParentUid } = require("../helpers/choreHelpers");
const { fetchUserCurrency } = require("../helpers");


/**
 * Group chores by user
 * 
 * @param {Array} children
 * @param {Array} choreHistory
 * @returns {Array}
 */
const groupChoresByUser = (children, choreHistory, weekNumber) => {
	let groupedChores = {}

	groupedChores.weekNumber = weekNumber
	groupedChores.data = []
	groupedChores.isCurrentWeek = false

	if (moment().week() === weekNumber) groupedChores.isCurrentWeek = true

	children.forEach(child => {
		let filteredChild = {
			uid: child.uid,
			firstName: child.dataValues.firstName,
			lastName: child.dataValues.lastName,
			profileImageUrl: child.dataValues.profileImageUrl || null,
		}
		filteredChild.data = choreHistory.filter(value => value.uid === child.uid)

		if (filteredChild.data.length) groupedChores.data.push(filteredChild)
	})
	return groupedChores;
};

/**
 * pending approval chores for last 4 weeks
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {Array}
 */
const pendingApprovalChores = async (req, res, next) => {


	try {
		// Fetch children from parent uid
		const { uid } = req.body
		const user = await getChildrenByParentUid(uid);
		let currency = await fetchUserCurrency(req, uid)

		if (!user?.children?.length) {
			return res.status(200).send({
				statusCode: 200,
				response: {
					pendingApproval: []
				}
			});
		}

		// get the uids of childs
		const uids = user.children.map(child => child.uid);

		const currentWeekNumber = moment().week();
		let weeks = [];
		for (let i = 0; i < 4; i++) { weeks = [...weeks, currentWeekNumber - i]; }

		let pendingApprovalGrouped = []

		for (const weekNumber of weeks) {
			const response = await ChoresHistory.updateMany({ readed: false }, { readed: true }).exec();
			console.log(response)

			let choreHistoryResult = await ChoresHistory.find({
				week: weekNumber,
				uid: { $in: uids },
				isApproved: false
			}).lean()

			if (!choreHistoryResult || !choreHistoryResult.length) continue;

			choreHistoryResult = choreHistoryResult.map((record) => {
				return {
					...record,
					amount: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(record.amount)
				}

			})

			pendingApprovalGrouped.push(groupChoresByUser(user.children, choreHistoryResult, weekNumber))
		}

		return res.status(200).send({
			statusCode: 200,
			response: {
				pendingApproval: pendingApprovalGrouped
			}
		});
	}
	catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}
}


module.exports = pendingApprovalChores