const db= require("../mysql/models/index")
const moment = require('moment')
const { Op } = require('sequelize')

// delete chore transactions for more than 1 month old
const one_month_back_date = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')

const deleteChoreTransactions = async () => {
    // fetch the count of rows to be deleted
    // divide the number of rows to be deleted by 10k , so in each round we'll delete 10k transactions
    const response = await db.ChoreTransactions.destroy({
        where: {
            createdAt: {
                [Op.lte]: one_month_back_date,                
            }
        },
        limit: 10000
    })

    if(response) await deleteChoreTransactions()

}

module.exports = deleteChoreTransactions