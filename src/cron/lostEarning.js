const { Chore, ChoresHistory } = require("../models")
const moment = require("moment")
const LostEarnings = require("../models/lostEarnings")

const lostEarnings = async () => {

    try {

        const week = moment().subtract(1, 'weeks').week()
        const year = moment().subtract(1, 'weeks').year()

        const choreHistoryRecords = await ChoresHistory.find({
            week,
            year
        })

        let choreHistoryRecordsIds = choreHistoryRecords.map(record => record.choreId)
        // console.log("data", choreHistoryRecordsIds);return;

        const filter = {}
        if(choreHistoryRecordsIds.length) {
            filter._id = { $ne: choreHistoryRecordsIds }
        }

        // - fetch all chores
        const chores = await Chore.find(filter)
        if(!chores.length) return;

        const lostEarningData = chores.map(chore => {
            return {
                choreId: chore.id,
                title: chore.title,
                description: chore.description,
                uid: chore.uid,
                days: chore.days,
                choreType: chore.choreType,
                amount: chore.amount,
                week,
                year
            }
        })

        await LostEarnings.insertMany(lostEarningData)
    }
    catch (e) {
        console.log(e)
    }

}
module.exports = lostEarnings