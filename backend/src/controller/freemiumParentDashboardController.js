const { allChildWeeklyChoreTotal, userProfiles, jsonResponse, chorePaidAmount, owedAmount, moodleCategories, formatAmount, fetchUserCurrency } = require("../helpers")
const { ErrorHandler } = require("../helpers/errorHandler")
const { ChoresHistory } = require("../models")

const freemiumParentDashboardController = async (req, res, next) => {

    try {
        const { uid } = req.body

        let currency = await fetchUserCurrency(req, uid)

        // weekly chore total for all childs
        const weeklyChoreTotal = await allChildWeeklyChoreTotal(uid)
        const categories = await moodleCategories(req)


        // fetch all childs form users microservice
        const users = await userProfiles(req)

        const childrens = users?.data?.response?.data?.children

        for (const children of childrens) {
            const promises = []
            promises.push(owedAmount(children.uid))
            promises.push(chorePaidAmount(children.uid))
            promises.push(ChoresHistory.countDocuments({ uid: children.uid, readed: false }))
            const data = await Promise.all(promises)
            children.owedAmount = formatAmount(data[0].length ? data[0][0].sum || 0 : 0, currency)
            children.paidAmount = formatAmount(data[1].length ? data[1][0].sum || 0 : 0, currency)
            children.newRecords = data[2] ? true : false
        }

        return jsonResponse(res, 200, '', {
            weeklyChoreTotal: formatAmount(weeklyChoreTotal, currency),
            childrens,
            categories: categories?.data?.response?.categories || []
        })
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err))
    }
}
module.exports = freemiumParentDashboardController