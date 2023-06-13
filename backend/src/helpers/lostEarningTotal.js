const LostEarnings = require("../models/lostEarnings")
const moment = require("moment")

const lostEarningTotal = async (uid, dateRange = 'week') => {

    try {

        const filters = {
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

        return await LostEarnings.aggregate(
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
    catch (e) {
        throw e
    }
}
module.exports = lostEarningTotal