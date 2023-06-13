const { ErrorHandler } = require("../helpers/errorHandler");
const db  = require("../mysql/models/index")
const Chore = require("../models/choresModal")
const { CHORES_DELETED } = require('../config/messages');
const { jsonResponse } = require("../helpers");


/**
 * Delete the chrore as per the chore IDs
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
*/

const deleteChore = async (req, res, next) => {
    const choreId = req.params.id

    try {
        
        // delete chore from mongoose chores collection
        await Chore.findByIdAndRemove(choreId)

        // delete chore transactions from mysql choresTransactions table
        await db.ChoreTransactions.destroy({
            where: {
                choreId
            }
        })

        // send the ok response 
        return jsonResponse(res, 200, CHORES_DELETED)
    }
    catch(err){
        return next(new ErrorHandler(500, null, null, err))
    }
}

module.exports = deleteChore