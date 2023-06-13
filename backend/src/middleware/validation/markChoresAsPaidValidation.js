const { jsonResponse } = require("../../helpers");
const { ErrorHandler } = require("../../helpers/errorHandler");
const { markChoresAsPaidSchema } = require("../../validation-schemas")

const markChoresAsPaidValidation = (req, res, next) => {
    const result = markChoresAsPaidSchema.validate(req.body)
    if (result.error){
        return jsonResponse(res, 400, result.error.details[0].message)
    }
    return next()
}

module.exports = markChoresAsPaidValidation