'use strict';

const { SERVER_ERROR } = require('../config/messages')
const Logger = require('./logger');
const logger = new Logger('handler');

class ErrorHandler extends Error {

	constructor (statusCode, message, code, error) {
		super();
		this.statusCode = statusCode || 500;
		this.message = message || SERVER_ERROR;
		this.code = code || '';
		this.error = error || '';
	};   
};

const handleError = (err, res) => {
	let { statusCode, message, error, error_message, code } = err;
	statusCode = statusCode || 500;
	message = message || SERVER_ERROR;
	error = error;
	error_message = (error && error.message) ? error.message : message;
	logger.error(error_message, error);
	res.status(statusCode).json({
		statusCode,
		response: {
			message,
			code
		}
	});
};

module.exports = {
	ErrorHandler,
	handleError,
};