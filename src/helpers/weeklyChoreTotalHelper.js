const { Chore } = require("../models");

const weeklyChoreTotalHelper = async (uid) => {
    try {

        const filters = { uid }

        const data = await Chore.aggregate([{
            $match: filters
        }, {
            $group:
                { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } }
        }])

        return (data?.length && data[0]?.sum) ? data[0]?.sum?.toFixed(2) : 0.00;

    } catch (err) {
        throw err
    }
}

module.exports = weeklyChoreTotalHelper;