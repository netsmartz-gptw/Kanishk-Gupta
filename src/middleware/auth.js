const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')
const jwk = require('../config/jwks.json')
const { SERVER_ERROR, FORBIDDEN_ACCESS, USER_NOT_EXISTS, FORBIDDEN_ACCESS_EXCEPTION, ACCESS_TOKEN_EXCEPTION, ACCESS_TOKEN_REQUIRED, ACCESS_TOKEN_EXPIRED } = require("../config/messages");
const { ErrorHandler } = require('../helpers/errorHandler');
const db = require('../mysql/models');
const { jsonResponse } = require('../helpers');
const { userMiddlewareFields } = require('../config/config');

/**
 * This auth file first check for admin access token if present , fetch user details and attach to body
 * if not, it further check for access token in header, if not present, it return error
 * further we verify for access token, if not valid, return error
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

const auth = async (req, res, next) => {

	// first check if admin request
	if (req.headers.adminaccesstoken) {
		jwt.verify(req.headers.adminaccesstoken, process.env.NODE_API_KEY, async (err, decodedToken) => {

			if (err) return jsonResponse(res, 400, ACCESS_TOKEN_EXPIRED)

			const userUid = decodedToken.uid
			await setupUserDetails(req, userUid)
			
			return next()
		})
		return;
	}

	try {

		if (!req.headers.accesstoken) return jsonResponse(res, 400, ACCESS_TOKEN_EXPIRED, null, ACCESS_TOKEN_EXCEPTION)

		const env = process.env.NODE_ENV === 'production' ? process.env.DB_ENVIRONMENT : process.env.DB_ENVIRONMENT_LOCAL
		const pem = jwkToPem(jwk[env].keys[1])

		jwt.verify(req.headers.accesstoken, pem, { algorithms: ['RS256'] }, async function (err, decodedToken) {
			if (err) return jsonResponse(res, 400, ACCESS_TOKEN_EXPIRED)

			const userUid = decodedToken.sub

			await setupUserDetails(req, userUid)

			return next()
		})
	}
	catch (error) {
		if (error.code === "NotAuthorizedException") return jsonResponse(res, 400, error.message, null, error.code)
		return next(new ErrorHandler(500, SERVER_ERROR, null, error));
	}
}

const setupUserDetails = async (req, uid) => {
	// fetch user details
	const user = await db.Users.findOne({
		where: { uid },
		attributes: userMiddlewareFields,
		include: {
			model: db.role,
			attributes: ['role']
		}
	})
	if (!user) return jsonResponse(res, 400, USER_NOT_EXISTS)

	req.body.cognitoEmail = user.email;
	req.username = user.username;
	req.role = user.role.role;
	req.body.uid = user.uid;
	req.user = user
}

module.exports = auth;