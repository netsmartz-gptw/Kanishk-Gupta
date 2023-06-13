const { CHORES_CREATED } = require("../config/messages");
const { ErrorHandler } = require("../helpers/errorHandler");
const Chore = require("../models/choresModal");
const db = require("../mysql/models/index");
const { USER_NOT_EXISTS, PARENT_CHILD_NOT_ASSOCIATED, PARENT_CHILD_NOT_ASSOCIATED_EXCEPTION } = require('../config/messages');
const { notifications } = require("../config/config");
const createNotifications = require('../helpers/microservice-connection/createNotifications');
const { adminGetUsers, jsonResponse } = require("../helpers");
/**
 *  Create the chores as per weekly or as needed
 * 
 * @param {Request Object} req 
 * @param {Response Object} res 
 * @param {Next Middleware} next 
 * @returns {JSON}
 */
const createChore = async (req, res, next) => {

    const week_days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    let choresData = []

    try {
        const { data } = req.body
        const baseData = {
            title: req.body.title,
            description: req.body.description
        };
        let promise = []
        const uid = req.body.uid;

        const params = {
            multipleRecords: false,
            uids: [uid],
            attributes: ['uid'],
            joins: [
                {
                    model: db.Users,
                    as: 'children',
                    required: true,
                    attributes: ['uid']
                }
            ]
        }
        const parent = await db.Users.findOne({
            where: { uid },
            attributes: ['uid'],
            include: {
                model: db.Users,
                as: 'children',
                required: true,
                attributes: ['uid']
            },
        });

        if (!parent || !parent.children) return jsonResponse(res, 400, USER_NOT_EXISTS)

        const validChildUids = parent.children.map(child => child.uid);
        let isInvalid = false;
        for (const choreValue of data) {
            if (!validChildUids.includes(choreValue.uid)) { isInvalid = true; break; }
        }

        if (isInvalid) return jsonResponse(res, 400, PARENT_CHILD_NOT_ASSOCIATED, null, PARENT_CHILD_NOT_ASSOCIATED_EXCEPTION)

        for (userChore of data) {

            const days = userChore.choreType === 'asNeeded' ? week_days : [...new Set(userChore.days)]

            const amount = parseFloat(userChore.amount).toFixed(2)

            let userData = {
                ...baseData,
                days,
                uid: userChore.uid,
                choreType: userChore.choreType,
                autoApprove: userChore.autoApprove,
                amount: userChore.amount ? amount : 0.00,
            }

            const notification = {
                uid: userChore.uid,
                title: notifications.chore_created.title,
                description: notifications.chore_created.description,
                notificationType: notifications.chore_created.type
            }
            promise.push(createNotifications(null, [notification]))
            choresData.push(userData)
        }

        const chores = await Chore.insertMany(choresData)
        await Promise.all(promise)


        return res.status(201).send({
            statusCode: 201,
            response: {
                message: CHORES_CREATED,
                chores
            }
        })
    }
    catch (error) {
        return next(new ErrorHandler(500, null, null, error));
    }
}

module.exports = createChore