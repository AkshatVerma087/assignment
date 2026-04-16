function notFoundHandler(req, res, _next) {
    return res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
}

function globalErrorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    return res.status(status).json({
        message: err.message || 'Internal server error'
    });
}

module.exports = {
    notFoundHandler,
    globalErrorHandler
};
