const jsonResponse = (res, statusCode, message, data = {}, code = '') => {
    return res.status(statusCode).send({
        statusCode,
        response: {
            message,
            data,
            code
        }
    })
}

module.exports = jsonResponse