const { owedAmount, chorePaidAmount, jsonResponse } = require('../helpers')

const choreHistorySummaryController = async (req, res, next) => {
    const { uid } = req.body
    const childOwedAmount = await owedAmount(uid)
    const childPaidAmount = await chorePaidAmount(uid)

    return jsonResponse(res, 200, '', {
        childOwedAmount: childOwedAmount[0]?.sum || 0,
        childPaidAmount: childPaidAmount[0]?.sum || 0
    })
}

module.exports = choreHistorySummaryController