const { unauthorized } = require("../config/messages")
const { jsonResponse } = require("../helpers")
const { ErrorHandler } = require("../helpers/errorHandler")


/**
 * This middleware confirm the user role so that allowed role can only access the endpoint
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const allowedRoles = (roles) => {
    return function (req, res, next) {

        try {

            const { user } = req
            
            if (!roles.includes(user.role.role)) return jsonResponse(res, 400, unauthorized.message, null, unauthorized.exception)

            return next()

        } catch (error) {
            return next(new ErrorHandler(500, null, null, error));
        }
    }
}
module.exports = allowedRoles