"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    status;
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.CustomError = CustomError;
class ErrorHandler {
    error404(req, res) {
        return res.status(404).json({
            success: false,
            message: "route not found"
        });
    }
    unexceptionError(err, req, res, next) {
        const statusCode = err.status || 500;
        const message = err.message || 'Internal Server Error';
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
}
exports.default = new ErrorHandler;
