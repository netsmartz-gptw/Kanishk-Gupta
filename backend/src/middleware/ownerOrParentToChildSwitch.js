const { ErrorHandler } = require("../helpers/errorHandler");
const db = require("../mysql/models");
const { FORBIDDEN_ACCESS, FORBIDDEN_ACCESS_EXCEPTION } = require("../config/messages");
const { userMiddlewareFields } = require("../config/config");
const { jsonResponse } = require("../helpers");

/**
 * This middleare switch owner or parent deatils attach to by to child details if child uid is present in header along with parent accesstoken
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const ownerOrParentToChildSwitch = async (req, res, next) => {
    
    try {

        if (!req.headers.childuid) return next()

        const { user } = req

        /* Check if child UID has valid association to the parent UID along with the admin/parent's role */
        const child = await db.Users.findOne({
            where: { uid: req.headers.childuid },
            attributes: userMiddlewareFields,
            include: {
                model: db.Users,
                as: 'parent',
                required: true,
                where: { uid: user.uid },
                attributes: ['id', 'uid'],
                include: {
                    model: db.role,
                    where: {
                        role: ['admin', 'parent']
                    }
                }
            },
            logging: false
        });
        if (!child || !child.parent) {
            return jsonResponse(res, 400, FORBIDDEN_ACCESS, null, FORBIDDEN_ACCESS_EXCEPTION)
        }
        req.body.uid = req.headers.childuid;
        req.user = { uid: req.headers.childuid }
        req.parentUid = user.uid
        req.username = child.username;
        req.role = 'child';

        return next()
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err));
    }

}
module.exports = ownerOrParentToChildSwitch