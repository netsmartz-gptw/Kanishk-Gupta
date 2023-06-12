const { Chore } = require("../models");
const { getChildsUidsByParentUids } = require("./choreHelpers");

// fetch all child weekly chore total by parent
const allChildWeeklyChoreTotal = async (uid) => {

    try {

        // fetch child uids first 
        const childUids = await getChildsUidsByParentUids(uid)

        // create matching filter 
        const match = { uid: { $in: childUids } }


        const data = await Chore.aggregate([{
            $match: match
        }, {
            $group:
                { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } }
        }])

        return (data?.length && data[0]?.sum) ? data[0]?.sum?.toFixed(2) : 0.00;
    }
    catch (err) {
        throw err
    }
}
module.exports = allChildWeeklyChoreTotal