const { weeklyChoreTotalHelper, chorePaidAmount, owedAmount, totalEarnings, lostEarningTotal, projectedEarning, jsonResponse, fetchUserCurrency, formatAmount } = require("../helpers") 
const moment = require("moment")

const  childDashboardController = async (req, res, next) => {
    const { uid } = req.body

    let currency = await fetchUserCurrency(req, uid)
    
    // top bar weekly chore totalEarnedMonth, owed and paid amount (all time data)
    const weeklyChoreTotal = await weeklyChoreTotalHelper(uid)
    const OwedAmount = await owedAmount(uid)
    const PaidAmount = await chorePaidAmount(uid)

    // total earned for week, month and year
    const totalEarnedWeek = await totalEarnings(uid, 'week')
    const totalEarnedMonth = await totalEarnings(uid, 'month')
    const totalEarnedYear = await totalEarnings(uid, 'year')

    // lost earning for month and year only (week will have 0 always for current week)
    const lostEarningMonth = await lostEarningTotal(uid, 'month')
    const lostEarningYear = await lostEarningTotal(uid, 'year')

    // projected earning for month and year (:TODO)
    const projectedEarningMonth = await projectedEarning(uid, 'month')
    const projectedEarningYear = await projectedEarning(uid, 'year')

    const [daysLeftInMonth, daysPassedPercentage] = daysData()
    const [monthsLeft, monthsPassedPercentage] = yearData()


    return jsonResponse(res, 200, '', {
        weeklyChoreTotal: formatAmount(weeklyChoreTotal, currency),
        OwedAmount:       formatAmount(OwedAmount[0]?.sum || 0, currency),
        PaidAmount:       formatAmount(PaidAmount[0]?.sum || 0, currency),
        totalEarnedWeek:  formatAmount(totalEarnedWeek[0]?.sum || 0, currency),
        totalEarnedMonth: formatAmount(totalEarnedMonth[0]?.sum || 0, currency),
        totalEarnedYear:  formatAmount(totalEarnedYear[0]?.sum || 0, currency),
        lostEarningWeek: formatAmount(0, currency),
        lostEarningMonth: formatAmount(lostEarningMonth[0]?.sum || 0, currency),
        lostEarningYear:  formatAmount(lostEarningYear[0]?.sum || 0, currency),
        projectedEarning: {
            month: {
                amount: formatAmount(projectedEarningMonth, currency),
                daysLeftInMonth,
                daysPassedPercentage
            },
            year: {
                amount: formatAmount(projectedEarningYear, currency),
                monthsLeft,
                monthsPassedPercentage
            }
        },
        projectedEarningMonth: formatAmount(projectedEarningMonth, currency),
        projectedEarningYear: formatAmount(projectedEarningYear, currency)
    })
}

const daysData = () => {
    const daysInMonth = moment().daysInMonth()
    const monthLastDay = moment().endOf('month')
    const currentDate = moment()
    const currentDayNumber = currentDate.date()
    const daysLeftInMonth = monthLastDay.diff(currentDate, 'days')
    const daysPassedPercentage = parseFloat((currentDayNumber / daysInMonth) * 100).toFixed(2)

    return [daysLeftInMonth, daysPassedPercentage]
}

const yearData = () => {
    const currentMonth = moment().month() + 1
    const monthsLeft = 12 - currentMonth
    console.log('currentMonth: ' + currentMonth)
    const monthsPassedPercentage = parseFloat((currentMonth / 12) * 100).toFixed(2)
    return [monthsLeft, monthsPassedPercentage]
}

module.exports = childDashboardController