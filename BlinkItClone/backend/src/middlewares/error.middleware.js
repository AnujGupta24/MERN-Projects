export const errorHandler = (err, req, res, next) => {
	if (err.name === 'CastError') {
		return res.status(404).json({
			success: false,
			message: 'Resource not found',
		});
	}

	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		success: false,
		message: err.message || 'Internal server errror',
		errors: err.errors || [],
	});
};
