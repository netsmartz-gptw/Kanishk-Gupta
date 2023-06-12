const { ErrorHandler } = require("../helpers/errorHandler")
const Chore = require("../models/choresModal")
const db = require("../mysql/models/index")
const { NO_CHORES_FOUND } = require("../config/messages")
const moment = require('moment')
const { Op } = require('sequelize')
const { ChoresHistory } = require("../models")
const { formatAmount, fetchUserCurrency } = require("../helpers")


/**
 * Chore history logs of paid and owed chores
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const childChoreListingController = async (req, res, next) => {

	const { uid } = req.body;
	const { isApproved, isPaid, dateRange } = req.query;
	let { count, page } = req.query;
	count = parseInt(count) || 20;
	page = parseInt(page) || 1;
	const offset = (page - 1) * count;

	let filter = { uid };
	if (isApproved) { filter = { ...filter, isApproved: (isApproved == "true") ? true : false }; }
	if (isPaid) { filter = { ...filter, isPaid: isPaid == "true" ? true : false }; }

	if (dateRange) {
		let startDate;

		if (dateRange === 'week') startDate = moment().startOf('week').format('YYYY-MM-DD 00:00:00');
		if (dateRange === 'month') startDate = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
		if (dateRange === 'year') startDate = moment().startOf('year').format('YYYY-MM-DD 00:00:00');
		const endDate = moment().format('YYYY-MM-DD 23:59:59');

		filter = {
			...filter,
			createdAt: { $gte: startDate },
			endDate: { $lte: endDate }
		};
	}

	try {
		// Get total count of records
		const totalCount = await ChoresHistory.count(filter).exec();

		// Fetch chore history records as per filters and pagination
		let choreHistoryLogs = await ChoresHistory.find(filter)
			.sort({ createdAt: 'desc' })
			.skip(offset)
			.limit(count)
			.lean()

		if (choreHistoryLogs.length) {

			let currency = await fetchUserCurrency(req, uid)

			choreHistoryLogs = choreHistoryLogs.map(choreHistoryLog => {
				return {
					...choreHistoryLog,
					amount: formatAmount(choreHistoryLog.amount, currency),
				}
			})
		}

		return res.status(200).send({
			statusCode: 200,
			response: {
				chores: choreHistoryLogs,
				totalCount,
				filter
			}
		})
	} catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}
}

module.exports = childChoreListingController;