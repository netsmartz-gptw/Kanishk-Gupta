const { jsonResponse } = require("../../helpers");
const { ErrorHandler } = require("../../helpers/errorHandler");
const { markChoreAsCompletedSchema } = require("../../validation-schemas")

const markChoreAsCompletedValidation = (req, res, next) => {
    const result = markChoreAsCompletedSchema.validate(req.body)
    if (result.error){
        return jsonResponse(res, 400, result.error.details[0].message)
    }
    return next()
}

module.exports = markChoreAsCompletedValidation