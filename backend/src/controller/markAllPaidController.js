const { MARK_ALL_PAID } = require("../config/messages");
const { jsonResponse } = require("../helpers");
const { getChildsUidsByParentUids } = require("../helpers/choreHelpers");
const { ErrorHandler } = require("../helpers/errorHandler");
const { ChoresHistory } = require("../models");

const markAllPaidController = async (req, res, next) => {

    try {


        const { uid } = req.body

        // fetch child uids
        const childsUids = await getChildsUidsByParentUids(uid)

        // fetch all chorehistory records for all childs
        // mark all records as paid true for those which are approved
        await ChoresHistory.updateMany({
            isApproved: true,
            uid: {
                $in: childsUids
            }
        },
            {
                $set: {
                    isPaid: true,
                    paidOn: new Date()
                }
            }
        )

        return jsonResponse(res, 200, MARK_ALL_PAID)
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err))
    }
}
module.exports = markAllPaidController