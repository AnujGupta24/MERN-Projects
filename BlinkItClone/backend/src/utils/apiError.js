export class ApiError extends Error {
	constructor(statusCode, message = 'something went wrong', errors = []) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.success = false;
		this.errors = errors;

		Error.captureStackTrace(this, this.constructor);
	}
}
