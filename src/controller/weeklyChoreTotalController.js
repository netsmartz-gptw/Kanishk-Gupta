const db = require("../mysql/models/index")
const { getChildsUidsByParentUids } = require("../helpers/choreHelpers")
const { ErrorHandler } = require("../helpers/errorHandler")
const Chore = require("../models/choresModal")
const { fetchUserCurrency, jsonResponse } = require("../helpers")
const { USER_NOT_EXISTS } = require("../config/messages")

/**
 * calculate weekly chore total
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const weeklyChoreTotalController = async (req, res, next) => {
    
    try {

        const uid = req.body.uid
        let sumAmount        

        const user = await db.Users.findOne({
            where: {
                uid
            },
            attributes: ['roleId'],
            include: {
                model: db.role,
                required: true,
                attributes: ['role']
            },

        })
        if(!user) return jsonResponse(res, 400, USER_NOT_EXISTS)

        let currency = await fetchUserCurrency(req, uid)

        let match = { uid };

        if (user.role.role === 'admin' || user.role.role === 'parent') {
            const childUids = await getChildsUidsByParentUids(uid)
            match = { uid: { $in: childUids } }
        }

        const data = await Chore.aggregate([{
            $match: match
        }, {
            $group:
                { _id: null, sum: { $sum: "$amount" }, count: {$sum: 1} }
        }])

        sumAmount = (data?.length && data[0]?.sum) ? data[0]?.sum?.toFixed(2) : 0.00;

        return res.status(200).send({
            statusCode: 200,
            response: {
                amount: new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(sumAmount),
                unformattedAmount: sumAmount,
                count: data[0]?.count || 0
            }
        })

    } catch (err) {
        return next(new ErrorHandler(500, null, null, err))
    }
}

module.exports = weeklyChoreTotalController
