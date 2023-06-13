const { ErrorHandler } = require("../helpers/errorHandler")
const Chore = require("../models/choresModal")
const db= require("../mysql/models/index")
const { NO_CHORES_FOUND } = require("../config/messages")
const moment = require('moment')
const { Op } = require('sequelize')
const { ChoresHistory } = require("../models")
const { fetchUserCurrency, jsonResponse } = require("../helpers")


/**
 * chore history logs of last 4 weeks and current completed chores
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
*/

const getChoreList = async (req, res, next) => {

    const { uid } = req.body
    const completed = req.query.completed
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const week_start_date = moment().startOf('week').format('YYYY-MM-DD')
    const week_end_date = moment().endOf('week').format('YYYY-MM-DD')
    let ids = []

    try{
        
        // get chore by id first, if chore not found return error
        const chores = await Chore.find({uid}).sort({
            title: 'asc'
        }).exec()
        if(!chores || !chores.length) return jsonResponse(res, 400, NO_CHORES_FOUND)

        // fetch currency from user config first 
        let currency = await fetchUserCurrency(req, uid)
        console.log("currency", currency)

        // fetch chores assigned to child
        const filteredChores = chores.map((value) => {
            ids=[...ids,value._id.toString()]
            return {
                id:value._id.toString(),
                title:value.title,
                desc:value.description,
                choreType: value.choreType,
                amount: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value.amount),
                days: value.choreType === 'asNeeded' ? weekDays : value.days,
                date: value.createdAt
            }
        })

        // fetch chores transactions
        const choresTxns = await db.ChoreTransactions.findAll({
            where:{
                choreId: ids,
                chore_date: {
					[Op.gte]: week_start_date,
					[Op.lte]: week_end_date
				},
            },
            attributes:['choreId','chore_date','completed'],
            raw: true
        })

        let filteredItems = [];
        filteredChores.forEach((choreValue, index) => {

            const txnObj = {
                choreId:choreValue.id,
                title: choreValue.title,
                desc: choreValue.desc,
                amount: choreValue.amount,
                choreType: choreValue.choreType,
                data: [],
                isAnyOneCompleted:false
            };

            choreValue.days.forEach(dayValue => {
                
                const chore_date = moment().day(dayValue).format('YYYY-MM-DD').toString()

                let dayTxn = {
                    chore_day: dayValue,
                    completed: false,
                };

                choresTxns.forEach(txnValue => {

                    txnDate = moment(txnValue.chore_date).format('YYYY-MM-DD').toString()
                 
                    if (choreValue.id === txnValue.choreId && chore_date == txnDate && txnValue.completed) {
                        dayTxn.completed = true;
                        txnObj.isAnyOneCompleted=true
                    }
                });
             
                txnObj.data = [ ...txnObj.data, dayTxn];
              
            });

            // check for any day chore is completed
            if (completed && txnObj.isAnyOneCompleted || !completed){
                delete txnObj.isAnyOneCompleted
                filteredItems = [ ...filteredItems, txnObj];
            }
    
        });

        // get last 4 weeks logs of approved chores
        const currentWeek = moment().week()
        const weekArray = [
            currentWeek,
            currentWeek - 1,
            currentWeek - 2,
            currentWeek - 3,
        ]

        let choreHistoryLogs = await ChoresHistory.find({
            week: {
                $in: weekArray
            },
            isApproved: true,
            uid
        }).lean()

        // compare chores and choreHistoryLogs, if any chore for current week is completed, remove it from chores list
        filteredItems = filteredItems.filter(item => {
            const log = choreHistoryLogs.find((log) => log.choreId.toString() === item.choreId.toString() && log.week === currentWeek)
            return log ? false : true
        })
        
        choreHistoryLogs = choreHistoryLogs.map(log => {
            return {
                ...log,
                amount: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(log.amount)
            }
        })

        return res.status(200).send({
            statusCode: 200,
            response: {
                chores: filteredItems,
                choreHistoryLogs
            }
        })
    }
    catch(error){
        return next(new ErrorHandler(500, null, null, error))
    }
}

module.exports = getChoreList;