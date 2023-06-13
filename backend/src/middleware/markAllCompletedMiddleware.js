const { CHORE_NOT_FOUND, CHORE_TYPE_NOT_COMPATIBLE, ALREADY_APPROVED_FOR_CURRENT_WEEK, SELECT_ALL_NOT_ALLOWED_UNTIL_LAST_DAY } = require("../config/messages");
const { ErrorHandler } = require("../helpers/errorHandler")
const { Chore, ChoresHistory } = require("../models")
const moment = require("moment");
const db = require("../mysql/models")
const { ucfirst } = require("../helpers/utils")
const { Op } = require('sequelize');
const { jsonResponse } = require("../helpers");

/**
 * to mark all chores as completed of current week
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 

 */
const markAllCompleted = async (req, res, next) => {

    // get body parameters
    const { choreid, completed, uid } = req.body
    const week = moment().week()

    const week_start_date = moment().startOf('week').format('YYYY-MM-DD')
    const week_end_date = moment().endOf('week').format('YYYY-MM-DD')

    // fetch chore details
    const chore = await Chore.findById(choreid)
    if (!chore) return jsonResponse(res, 400, CHORE_NOT_FOUND)

    // attach chore to body for next middleware
    req.body.chore = chore

    // First check if not asNeeded type chore
    if (chore.choreType === "asNeeded") return jsonResponse(res, 400, CHORE_TYPE_NOT_COMPATIBLE)

    // first check if parent already approved that week chores, if yes then do not allow uncheck    
    const isLogExists = await ChoresHistory.findOne({
        choreId: choreid,
        week,
        isApproved: true,
    })
    if (isLogExists) return jsonResponse(res, 400, ALREADY_APPROVED_FOR_CURRENT_WEEK)

    // - first check if current date is the last day of the task assigned or more
    // get current day index and last working day index of chore to compare if current day no is greater than or equal to last assigne day 
    const sortedWeekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDayIndex = moment().day()
    const assignedDays = chore.days

    const daysIndexes = []
    assignedDays.map(day => {
        const findDay = sortedWeekDays.find(sortedDay => sortedDay === day)
        const dayIndex = sortedWeekDays.indexOf(findDay)
        daysIndexes.push(dayIndex)
    })

    const maxIndex = Math.max(...daysIndexes)

    if (currentDayIndex < maxIndex) return jsonResponse(res, 400, SELECT_ALL_NOT_ALLOWED_UNTIL_LAST_DAY)


    // "Select all" button checked'
    // mark all day chore as completed ( fetch all days chore assigned and create log for every day)
    // else delete all markAsCompleted record for the days assigned
    if (completed) {
        
        const choreTransactions = []
        chore.days.map(day => {
            const date = moment().day(ucfirst(day))
            const data = {
                chore_date: date,
                chore_day: day,
                choreId: choreid,
                completed: 1,
            }
            choreTransactions.push(data)
        })
        await db.ChoreTransactions.bulkCreate(choreTransactions)

    }
    else{
        
        await db.ChoreTransactions.destroy({
            where: {
                choreId: choreid,
                chore_date: {
                    [Op.gte]: week_start_date,
                    [Op.lte]: week_end_date
                },
                completed: 1                
            }
        })
    }

    // call the next middleware in chain 
    return next()
}

module.exports = markAllCompleted