const { fetchUserCurrency } = require("../helpers");
const { getChildrenByParentUid } = require("../helpers/choreHelpers")
const { ErrorHandler } = require("../helpers/errorHandler")
const Chore = require("../models/choresModal")


/**
 * Group chores by user
 * 
 * @param {Array} children
 * @param {Array} chores
 * @returns {Array}
 */
const groupChoresByUser = (children, chores) => {
	let groupedChores = [];
	children.map(child => {
		let filteredChild = {
			uid: child.uid,
			firstName: child.dataValues.firstName,
			lastName: child.dataValues.lastName,
			profileImageUrl: child.dataValues.profileImageUrl || null,
		};
		filteredChild.data = chores.filter(value => value.uid === child.uid);
		// groupedChores = [ ...groupedChores, filteredChild ];
		if (filteredChild.data.length) { groupedChores = [...groupedChores, filteredChild]; }
	});
	return groupedChores;
};

/** 
 * Get all latest child chores 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
*/
const getAllChildsChores = async (req, res, next) => {

	try {

		// Fetch children from parent uid
		const { uid } = req.body
		const user = await getChildrenByParentUid(uid);
		let currency = await fetchUserCurrency(req, uid)

		if (!user?.children?.length) {
			return res.status(200).send({
				statusCode: 200,
				response: {
					groupedChores: []
				}
			});
		}

		const childsUids = user.children.map(child => child.uid);

		let chores = await Chore.find({
			uid: {
				$in: childsUids
			}
		}).lean()

		chores = chores.map(chore => {
			return {
				...chore,
				amount: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(chore.amount),
				unformattedAmount: chore.amount,
			}
		})

		// sort the chores and get the sorted by date chores list 
		const dateSortedList = chores.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt);
		})

		// get the latest chore 
		const latestChore = dateSortedList[0]

		// filter out the latest chore from the list
		const filterdChores = chores.filter(chore => chore._id.toString() !== latestChore._id.toString())

		let sortedChores = filterdChores.sort(function (x, y) {
			if (x.title?.toLowerCase() < y.title?.toLowerCase()) { return -1; }
			if (x.title?.toLowerCase() > y.title?.toLowerCase()) { return 1; }
			return 0;
		})

		// add the latest chore at top
		sortedChores.unshift(latestChore)

		sortedChores = await groupChoresByUser(user.children, chores);

		return res.send({
			statusbar: 200,
			response: {
				groupedChores: sortedChores
			}
		})
	}
	catch (error) {
		return next(new ErrorHandler(500, null, null, error))
	}

};

module.exports = getAllChildsChores;