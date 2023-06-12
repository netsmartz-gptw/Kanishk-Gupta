const { ucfirst } = require('../helpers/utils')
const db = require("../mysql/models/index")
const {
	FUTURE_DATE_NOT_ALLOWED,
	CHORE_ALREADY_COMPETED_FOR_CURRENT_WEEK,
	CHORE_NOT_ASSIGNED_FOR_GIVEN_DAY,
	ALREADY_APPROVED_FOR_CURRENT_WEEK,
	CHORE_ALREADY_MARKED_FOR_GIVEN_DAY,
	CHORE_NOT_FOUND 
} = require("../config/messages")
const { Chore, ChoresHistory } = require("../models");
const moment = require('moment');
const { ErrorHandler } = require('../helpers/errorHandler');
const { Op } = require('sequelize')
const { notifications } = require('../config/config')
const createNotifications = require('../helpers/microservice-connection/createNotifications')
const { getParentByChildUid } = require('../helpers/choreHelpers');
const { jsonResponse } = require('../helpers');

/**
 * mark chore as complete 
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 
 */
const markAsComplete = async (req, res, next) => {

	try {
		const { uid, choreid } = req.body

		// check if chore belongs to the current user
		const chore = await Chore.findOne({
			_id: choreid,
			uid,
		})
		if (!chore) return jsonResponse(res, 400, CHORE_NOT_FOUND)

		// attach chore in request object
		req.body.chore = chore

		const parentDetails = await getParentByChildUid(uid);
		const parentUid = parentDetails?.parent?.uid;

		// if a choreHistory record already exist in collection with approved status. do not allow child to modify the chore
		const isExist = await ChoresHistory.count({
			week: moment().week(),
			choreId: choreid,
			isApproved: true
		})

		if (isExist) return jsonResponse(res, 400, ALREADY_APPROVED_FOR_CURRENT_WEEK)

		// call method based on chore type
		if (chore.choreType === "asNeeded") {
			await markCompletedForAsNeeded(req, res, next, chore, parentUid)
		}
		else {
			await markeCompletedForRecurring(req, res, next, chore, parentUid)
		}
	} catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}

}


/**
 * mark chore as completed for as needed .
 * can be marked for a day only in week
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @param {Object} chore
 */
const markCompletedForAsNeeded = async (req, res, next, chore, parentUid) => {

	try {
		let promise = []
		const { choreid, day, completed } = req.body
		// get current date
		const currentDate = moment();

		const ucDay = ucfirst(day);
		let payload_chore_date = moment().day(ucDay);

		// check first if user is trying to mark a future day
		const validDate = currentDate.isSameOrAfter(payload_chore_date);
		if (!validDate) return jsonResponse(res, 400, FUTURE_DATE_NOT_ALLOWED)

		// check if chore is already marked once this week
		const week_start_date = currentDate.startOf('week').format('YYYY-MM-DD')
		const week_end_date = currentDate.endOf('week').format('YYYY-MM-DD')

		// check if chore exists in database
		const ChoreTransaction = await db.ChoreTransactions.findOne({
			where: {
				choreId: req.body.choreid,
				chore_date: {
					[Op.gte]: week_start_date,
					[Op.lte]: week_end_date
				},
				completed: 1
			}
		})

		const choreDate = payload_chore_date.format('YYYY-MM-DD')

		// check if chore is already completed once in current week and day is not same as requested then return error
		if (ChoreTransaction && ChoreTransaction.chore_day !== day)
			return jsonResponse(res, 400, CHORE_ALREADY_COMPETED_FOR_CURRENT_WEEK)

		// check if day is same and completed === true
		if (ChoreTransaction && ChoreTransaction.chore_day === day && completed === true)
			return jsonResponse(res, 400, CHORE_ALREADY_MARKED_FOR_GIVEN_DAY)

		// if chore is marked as imcompleted then delete the record from database
		// else create record in choretransactions table
		if (completed === false) {

			// delete chore transaction
			await db.ChoreTransactions.destroy({
				where: {
					choreId: chore._id.toString(),
					chore_date: {
						[Op.gte]: week_start_date,
						[Op.lte]: week_end_date
					},
					completed: 1
				}
			})

		}
		else {
			// create chore transaction for the day
			const transactiondata = {
				choreId: choreid,
				chore_date: choreDate,
				completed: 1,
				chore_day: day,
			};

			const notification = {
				uid: parentUid,
				title: notifications.chore_completed.title,
				description: notifications.chore_completed.description,
				notificationType: notifications.chore_completed.type
			}
			
			await db.ChoreTransactions.create(transactiondata);
			promise.push(createNotifications(null, [ notification ]))
			await Promise.all(promise)
		}

		// call the next middleware in chain
		return next()

	} catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}
}

/**
 * Mark chore as completed for current week 
 * chore can't be marked completed for future dates
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @param {Object} chore
 */
const markeCompletedForRecurring = async (req, res, next, chore, parentUid) => {
	try {
		let promise = []
		// check if chore belongs to the current user
		const { day } = req.body

		// get current date 
		const currentDate = moment()
		let choreDate = moment().day(day);

		// if chore is not assigned for given day, it should not be marked for that day
		if (!chore.days.includes(day)) return jsonResponse(res, 400, CHORE_NOT_ASSIGNED_FOR_GIVEN_DAY)

		// if day/date is in future, then don't allow to mark for that day
		const validDate = currentDate.isSameOrAfter(choreDate);
		if (!validDate) return jsonResponse(res, 400, FUTURE_DATE_NOT_ALLOWED)

		// get the formatted date
		choreDate = choreDate.format('YYYY-MM-DD').toString();

		// check if chore transaction already exist in transactions table
		// if exists, then update the record
		// if not then create a new transaction record
		const checkExists = await db.ChoreTransactions.findOne({
			where: {
				chore_date: choreDate,
				choreId: req.body.choreid,
			}
		});
		if (checkExists) {
			let updateData = { completed: req.body.completed };
			await db.ChoreTransactions.update(updateData, { where: { choreid: req.body.choreid, chore_date: choreDate } })
		} else {
			const transactiondata = {
				choreId: req.body.choreid,
				chore_date: choreDate,
				completed: req.body.completed,
				chore_day: req.body.day,
			};
			const notification = {
				uid: parentUid,
				title: notifications.chore_completed.title,
				description: notifications.chore_completed.description,
				notificationType: notifications.chore_completed.type
			}
			
			await db.ChoreTransactions.create(transactiondata);
			promise.push(createNotifications(null, [ notification ]))
			await Promise.all(promise)
		}

		// call the next middleware function in chain
		return next()
	}
	catch (error) {
		return next(new ErrorHandler(500, null, null, error));
	}
}

module.exports = markAsComplete;