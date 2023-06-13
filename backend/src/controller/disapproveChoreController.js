const { Op } = require("sequelize");
const moment = require('moment');
const { ErrorHandler } = require("../helpers/errorHandler");
const db = require("../mysql/models/index");
const { DISAPPROVE_CHORE } = require('../config/messages');
const ChoreHistory = require("../models/choresHistoryModal")
const { NO_RECORDS_FOUND } = require('../config/messages');
const { jsonResponse } = require("../helpers");

/**
 * Disappprove the chrore transactions of the week as per the chore IDs
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const disapproveChoreController = async (req, res, next) => {
	try {
		
		const choreHistoryID = req.params.id

		// get choreHistory Log
		const choreHistoryLog = await ChoreHistory.findById(choreHistoryID)
		if(!choreHistoryLog) next(new ErrorHandler(400, NO_RECORDS_FOUND));

		// get the week start and end date by week no
		const week_start_date = moment().day("Sunday").week(choreHistoryLog.week);
		const week_end_date =moment().day("Saturday").week(choreHistoryLog.week);
		
		// delete chore transaction logs
		await db.ChoreTransactions.destroy( {
			where: {
				choreId: choreHistoryLog.choreId.toString(),
				completed: true,
				chore_date: {
					[Op.between]: [ week_start_date, week_end_date ]
				}
			},
			logging: false		// console.log
		});

		await ChoreHistory.deleteOne({	_id:choreHistoryID })

		return jsonResponse(res, 200, DISAPPROVE_CHORE)
	}
	catch(error){
		return next(new ErrorHandler(500, null, null, error));
	}
}

module.exports = disapproveChoreController;