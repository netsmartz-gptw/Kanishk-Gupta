const { userMiddlewareFields } = require("../config/config");
const { ErrorHandler } = require("../helpers/errorHandler");
const db = require("../mysql/models");

const parentToOwnerSwitch = async (req, res, next) => {

    try {
        const { user } = req

        if (user.role.role !== 'parent') return next()

        // if user role is parent then fetch the owner uid using family id of the parent and set variables according to that

        const owner = await db.Users.findOne({
            where: { familyId: user.familyId, roleId: 1 },
            attributes: userMiddlewareFields,
            include: {
                model: db.role,
                attributes: ['role']
            },
            raw: true,
            nest: true
        })

        req.body.cognitoEmail = owner.email;
        req.username = owner.username;
        req.role = 'admin';
        req.body.uid = owner.uid;
        req.user = { uid: owner.uid }

        return next()
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err));
    }
}
module.exports = parentToOwnerSwitch