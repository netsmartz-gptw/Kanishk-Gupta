const { ChoresHistory } = require("../models")
const moment = require("moment")

const projectedEarning = async (uid, dateRange = 'month') => {

    try {

        // Get the start of the year
        const startOfYear = moment().startOf('year').toDate();

        // Get the current date
        const currentDate = moment().toDate();

        const filters = {
            paidOn: {
                $gte: startOfYear,
                $lte: currentDate
            },
            uid
        }

        // calculate the total of amount paid from start of year to current date
        const data = await ChoresHistory.aggregate(
            [
                {
                    $match: filters,
                },
                {
                    $group: { _id: null, sum: { $sum: "$amount" } }
                }
            ]
        )

        const totalEarning = data.length ? data[0].sum : 0

        const totalDaysTillNow = moment().dayOfYear();

        if (moment().isLeapYear()) {
            totalDaysTillNow++; // add an extra day for leap years
        }
        const averageEarning = parseFloat(totalEarning / totalDaysTillNow).toFixed(2)

        let projectedEarning = 0

        if (dateRange === 'month') {
            const daysInMonth = moment().daysInMonth()
            projectedEarning = parseFloat(averageEarning * daysInMonth).toFixed(2)
        }
        else if (dateRange === 'year') {
            const daysInYear = moment().isLeapYear() ? 366 : 365;
            projectedEarning = parseFloat(averageEarning * daysInYear).toFixed(2);
        }

        return projectedEarning
    }
    catch (err) {
        throw err
    }
}
module.exports = projectedEarning