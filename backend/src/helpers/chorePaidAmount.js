const { ChoresHistory } = require("../models")

const chorePaidAmount = (uid) => {
    
    try {
        return ChoresHistory.aggregate(
            [
                {
                    $match: { uid, isPaid: true }
                },
                {
                    $group:
                    {
                        _id: null,
                        sum: { $sum: "$amount" }
                    }
                }
            ]
        )
    }
    catch (err) {
        throw err
    }
}

module.exports = chorePaidAmount