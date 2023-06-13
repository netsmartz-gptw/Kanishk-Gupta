const { ChoresHistory } = require("../models")

const owedAmount = (uid) => {

    try {

        return ChoresHistory.aggregate(
            [
                {
                    $match: { uid, isPaid: false }
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

module.exports = owedAmount