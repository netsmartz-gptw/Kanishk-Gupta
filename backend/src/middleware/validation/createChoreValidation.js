const { jsonResponse } = require("../../helpers");
const { ErrorHandler } = require("../../helpers/errorHandler");
const { createChoreSchema } = require("../../validation-schemas")

const createChoreValidation = (req, res, next) => {
    const result = createChoreSchema.validate(req.body)
    if (result.error){
        return jsonResponse(res, 400, result.error.details[0].message)
    }
    return next()
}

module.exports = createChoreValidation