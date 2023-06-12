const db = require("../mysql/models/index")
const { Op } = require('sequelize')
const { ChoresHistory } = require("../models")
const { CHORE_MARK_AS_COMPLETED, CHORE_NOT_COMPLETED } = require("../config/messages")
const { ErrorHandler } = require("../helpers/errorHandler")
const moment = require('moment');
const { jsonResponse } = require("../helpers")


// this middleware checks for the completed chore count and assigned chore count for weekly chore and create/delete log in choreHistory collection
// if chore type is asneeded this middleware check if chore is completed for one day and create ChoreHistory log else deletes the log if not marked for one day

const checkSyncCompeltedChores = async (req, res, next) => {

    try {



        // check if chore belongs to the current user
        const { choreid, day, chore } = req.body

        const week_start_date = moment().startOf('week').format('YYYY-MM-DD')
        const week_end_date = moment().endOf('week').format('YYYY-MM-DD')

        // first check for type of chore 
        if (chore.choreType === "weekly") {

            // check for how many days chores are completed
            // if chore transactions count and actually chore days count is same, then create a recrod for parent for approval 
            // if not then delete the chore_log if exist in database        

            const choreDbCount = await db.ChoreTransactions.count({
                where: {
                    choreId: req.body.choreid,
                    chore_date: {
                        [Op.gte]: week_start_date,
                        [Op.lte]: week_end_date
                    },
                    completed: 1
                }
            })

            // get the no of days chore is assigned
            const choreDaysCount = chore.days.length

            // if count is equal, then create log in chores transactions collection
            // else delete log if exist for the chore and week
            if (choreDaysCount === choreDbCount) {

                const query = {
                    choreId: choreid,
                    week: moment().week()
                }

                // create final object for insert/update
                const update = {
                    ...chore.toObject(),
                    completed_on: chore?.days,
                    isApproved: chore?.autoApprove,
                    isPaid: false,
                    startd_on: week_start_date,
                    ended_on: week_end_date,
                    week: moment().week(),
                    year: moment().year(),
                    readed: chore?.autoApprove // if chore is auto approved, then readed will be true
                }

                // delete the not required fields
                delete update._id
                delete update.createdAt
                delete update.updatedAt
                delete update.__v

                const options = { upsert: true };

                await ChoresHistory.updateOne(query, update, options)
            }
            else {
                const data = {
                    choreId: choreid,
                    week: moment().week(),
                    year: moment().year()
                }
                await ChoresHistory.deleteOne(data)
            }
        }
        else if (chore.choreType === 'asNeeded') {

            // if completed == true then create the chore log in choreHistory collection
            // else delete the chore log if exist in choreHistory collection
            if (req.body.completed) {
                // create final object for insert/update
                const data = {
                    ...chore.toObject(),
                    completed_on: [day],
                    choreId: choreid,
                    isApproved: chore?.autoApprove,
                    isPaid: false,
                    startd_on: week_start_date,
                    ended_on: week_end_date,
                    week: moment().week(),
                    year: moment().year(),
                    readed: chore?.autoApprove // if chore is auto approved, then readed will be true
                }

                // delete the not required fields
                delete data._id
                delete data.createdAt
                delete data.updatedAt
                delete data.__v

                await ChoresHistory.create(data)
            }
            else {
                // delete log from choreHistory collection
                await ChoresHistory.deleteOne({
                    choreId: chore._id.toString(),
                    week: moment().week(),
                    year: moment().year()
                })
            }
        }
        else {
            return;
        }

        // create response message keeping in mind that if stats completed or not 
        const message = req.body.completed === true ? CHORE_MARK_AS_COMPLETED : CHORE_NOT_COMPLETED

        // return response message
        return res.status(200).send({
            response: {
                statusCode: 200,
                message
            }
        })
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err));
    }
}

module.exports = checkSyncCompeltedChores