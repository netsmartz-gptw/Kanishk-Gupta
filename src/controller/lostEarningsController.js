const { jsonResponse, formatAmount, fetchUserCurrency } = require("../helpers")
const { ErrorHandler } = require("../helpers/errorHandler")
const LostEarnings = require("../models/lostEarnings")
const moment = require("moment")

const lostEarningsController = async (req, res, next) => {
    try {


        const { uid } = req.body
        let { count, page, dateRange } = req.query;
        count = parseInt(count) || 20;
        page = parseInt(page) || 1;
        const offset = (page - 1) * count;

        const filters = {
            uid
        }

        if (dateRange == 'weekly') {
            filters.week = moment().week()
            filters.year = moment().year()
        }
        else if (dateRange == 'month') {
            filters.week = {
                $gte: moment().startOf('month').week(),
                $lte: moment().endOf('month').week()
            }

            filters.year = moment().year()
        }
        else if (dateRange == 'year') {
            filters.year = moment().year()
        }

        const total = await LostEarnings.count(filters)

        let lostEarnings = await LostEarnings
            .find(filters)
            .sort({ createdAt: 'desc' })
            .skip(offset)
            .limit(count)
            .lean()

        if (lostEarnings.length) {

            let currency = await fetchUserCurrency(req, uid)

            lostEarnings = lostEarnings.map(lostEarning => {
                return {
                    ...lostEarning,
                    amount: formatAmount(lostEarning.amount, currency)
                }
            })
        }

        return jsonResponse(res, 200, '', { lostEarnings, page, count, total })
    }
    catch (err) {
        return next(new ErrorHandler(500, null, null, err))
    }
}
module.exports = lostEarningsController