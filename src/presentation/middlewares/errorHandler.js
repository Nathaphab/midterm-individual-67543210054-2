// src/presentation/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    
    let statusCode = 500;
    
    // แปลง Error Message เป็น HTTP Status Code
    if (err.message === 'Student not found') {
        statusCode = 404;
    } else if (
        err.message.includes('required') || 
        err.message.includes('Invalid') || 
        err.message.includes('Cannot') 
    ) {
        statusCode = 400;
    } else if (err.message.includes('exists')) {
        statusCode = 409;
    }
    
    res.status(statusCode).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorHandler;