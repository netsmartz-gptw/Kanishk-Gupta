const { ChoresHistory } = require("../models")
const moment = require("moment")

// all chores which are approved are considered as earning
// so total earning means records which are approved
const totalEarnings = async (uid, dateRange = 'week') => {

    try {

        const filters = {
            isApproved: true,
            uid
        }

        if (dateRange == 'week') {
            filters.week = moment().week()
            filters.year = moment().year()
        }
        else if (dateRange == 'month') {
            filters.week = {
                $gte: moment().startOf('month').week(),
                $lte: moment().endOf('month').week()
            }

            filters.year = moment().year()
        }
        else if (dateRange == 'year') {
            filters.year = moment().year()
        }

        return await ChoresHistory.aggregate(
            [
                {
                    $match: filters,
                },
                {
                    $group: { _id: null, sum: { $sum: "$amount" } }
                }
            ]
        )

    }
    catch (error) {
        throw error
    }

}

module.exports = totalEarnings