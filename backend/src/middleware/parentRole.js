const db = require("../mysql/models/index");
const { FORBIDDEN_ACCESS, FORBIDDEN_ACCESS_EXCEPTION } = require('../config/messages');
const { ErrorHandler } = require('../helpers/errorHandler');
const { jsonResponse } = require("../helpers");

const validRoles = ['admin', 'parent'];

/**
 * Check if user have the permission to access the API
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const parentRole = async (req, res, next) => {
	const uid = req.body.uid;
	try {
		const roleDetails = await db.role.findOne({
			attributes: ['id', 'role'],
			include: {
				model: db.Users,
				requred: true,
				where: { uid },
				attributes: ['uid']
			},
            logging: false
		});
		if (!roleDetails || !roleDetails.role || !validRoles.includes(roleDetails.role)) {
			return jsonResponse(res, 403, FORBIDDEN_ACCESS, null, FORBIDDEN_ACCESS_EXCEPTION)
		}
		return next()
	} catch (error) {
		return next(new ErrorHandler(500, null, null, error));		
	}
}

module.exports = parentRole;