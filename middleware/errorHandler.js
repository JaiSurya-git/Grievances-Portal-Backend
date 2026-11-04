const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message);

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Multer errors
    if (err instanceof multer.MulterError) {
        statusCode = 400;

        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size must not exceed 5 MB.';
        } else {
            message = 'File upload failed: ' + err.message;
        }
    }

    // Handle invalid file types
    if (err.statusCode === 400) {
        statusCode = 400;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500
            ? 'Internal Server Error'
            : message
    });
};

module.exports = errorHandler;