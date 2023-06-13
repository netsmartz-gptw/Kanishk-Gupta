const { ErrorHandler } = require("../helpers/errorHandler");
const db = require("../mysql/models/index")

/**
 * Fetch predefined chores 
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const fetchPredefineChore = async (req, res, next) => {

    try {
        const predefineChores = await db.PredefineChores.findAll({
            attributes: ['title', "desc"]
        })

        return res.status(200).send({
            statusCode: 200,
            response: {
                chores: predefineChores
            }
        })
    }
    catch (error) {
        return next(new ErrorHandler(500, null, null, error))
    }
}

module.exports = fetchPredefineChore