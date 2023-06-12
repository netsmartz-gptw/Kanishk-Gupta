const { jsonResponse } = require("../../helpers");
const { ErrorHandler } = require("../../helpers/errorHandler");
const { editChoreSchema } = require("../../validation-schemas")

const editChoreValidation = (req, res, next) => {
    const result = editChoreSchema.validate(req.body)
    if (result.error){
        return jsonResponse(res, 400, result.error.details[0].message)
    }
    return next()
}

module.exports = editChoreValidation