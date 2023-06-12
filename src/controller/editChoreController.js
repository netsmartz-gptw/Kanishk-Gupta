const moment = require('moment')
const { CHORES_EDITED , CHORE_NOT_FOUND} = require("../config/messages");
const { ErrorHandler } = require("../helpers/errorHandler")
const { Chore, ChoresHistory } = require("../models")
const db = require("../mysql/models/index")
const { Op } = require('sequelize');
const { jsonResponse } = require('../helpers');

/**
 * Edit the chrore transactions of the current  week as per the chore IDs
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const editChoreController = async (req, res, next) => {
    try{
        
        const choreId  = req.params.choreId
        const {title, description, days, choreType, autoApprove, amount} = req.body

        const currentDate = moment();
        const week_start_date = currentDate.startOf('week').format('YYYY-MM-DD')
		const week_end_date = currentDate.endOf('week').format('YYYY-MM-DD')

        // chore data to be edited 
        const chore_data= {
            title:title,
            description:description,
            choreType:choreType,
            autoApprove:autoApprove,
            amount:amount
        }

        // if chore type is weekly days assigned by parent will be sent else in case of asNeeded all weekdays will be send
        if(choreType === 'weekly') {
            chore_data.days = days
        }
        
        // query to update chore w.r.t to choreId in chores table
        const chore  =  await Chore.updateOne({
            _id: choreId
        },
        {
            $set:chore_data
        }).exec()

        // deleting the chore transaction for the updated data of current week from chore transaction table w.r.t choreId and current week
        await db.ChoreTransactions.destroy({
            where: {
                choreId,
                chore_date: {
					[Op.gte]: week_start_date,
					[Op.lte]: week_end_date
				},
            }
        })

        // deleting the chores log for updated data and if not approved from Chore History table w.r.t choreId and not approved
        await ChoresHistory.deleteOne({
            choreId: choreId,
            isApproved: false
        })

        if(!chore) return jsonResponse(res, 400, CHORE_NOT_FOUND)

        return jsonResponse(res, 200, CHORES_EDITED)
    }
    catch (error) {
        return next(new ErrorHandler(500, null, null, error))
    }
}

module.exports = editChoreController