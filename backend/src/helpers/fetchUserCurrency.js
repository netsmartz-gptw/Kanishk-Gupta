const db = require("../mysql/models");
const getUserConfig = require("./microservice-connection/getUserConfig");

const fetchUserCurrency = async (req, uid, role = 'unknown') => {

    try {



        let parentUid;

        if (role === 'parent' || role === 'admin') {
            parentUid = uid
        }
        else {
            parentUid = await fetchParentUid(uid)
        }

        // fetch config from mongo for parent currency
        const config = await getUserConfig(req)
        console.log('config from mic 1', config?.data?.response?.data)

        // return user config or default to USD
        return config?.data?.response?.data?.currency?.code || 'USD'
    }
    catch (err) {
        throw err
    }

}

const fetchParentUid = async (uid) => {

    try {

        const user = await db.Users.findOne({
            where: { uid },
            attributes: ['id', 'uid', 'roleId'],
            include: {
                model: db.role,
                attributes: ['role']
            },
        })
        if (!user) { return next(new ErrorHandler(400, USER_NOT_EXISTS)); }

        let findUid;

        if (user.role.role == 'admin' || user.role.role == 'parent') {
            findUid = user.uid;
        }
        // condition to fetch parent uid
        else {

            // get parent id from ParentChild table
            const parent = db.ParentChild.findOne({
                where: { child_id: user.id },
                attributes: ['id']
            })

            // get parent id from users table
            const findParent = await db.Users.findOne({
                where: { id: parent.id },
                attributes: ['uid']
            })
            findUid = findParent.uid
        }

        return findUid
    }
    catch (error) {
        throw error
    }
}

module.exports = fetchUserCurrency