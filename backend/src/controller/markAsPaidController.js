const { FORBIDDEN_ACCESS, NOT_AUTHORIZED_EXCEPTION, NO_RECORDS_FOUND, APPROVE_CHORE_FIRST, MARKED_AS_PAID_SUCCESS } = require("../config/messages")
const { jsonResponse } = require("../helpers")
const { getChildsUidsByParentUids } = require("../helpers/choreHelpers")
const { ErrorHandler } = require("../helpers/errorHandler")
const { ChoresHistory } = require("../models")

const markAsPaidController = async (req, res, next) => {

    try {

        const choreHistoryID = req.params.id
        const { uid } = req.body

        // - fetch the choreHistory record first
        const choreHistoryRecord = await ChoresHistory.findById(choreHistoryID)
        if (!choreHistoryRecord) return jsonResponse(res, 400, NO_RECORDS_FOUND)

        // - check if record belongs to one of parent child
        const childsUids = await getChildsUidsByParentUids(uid)
        if (!childsUids) return jsonResponse(res, 400, NO_RECORDS_FOUND)

        if (!childsUids.includes(choreHistoryRecord.uid)) return jsonResponse(res, 400, FORBIDDEN_ACCESS, null, NOT_AUTHORIZED_EXCEPTION)

        // - check if chore is marked as approved or not
        if (!choreHistoryRecord.isApproved) return jsonResponse(res, 400, APPROVE_CHORE_FIRST)

        // - set isPaid true and paidOn date
        await ChoresHistory.updateOne({ _id: choreHistoryID }, { isPaid: true, paidOn: new Date() })

        // - return success message    
        return jsonResponse(res, 200, MARKED_AS_PAID_SUCCESS)
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err))
    }
}

module.exports = markAsPaidController