import { NextFunction, Request, Response } from "express";

export class CustomError extends Error {
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
    }
}

class ErrorHandler {
    error404(req: Request, res: Response): Response {
        return res.status(404).json({
            success: false,
            message: "route not found"

        });
    }

    unexceptionError(err: CustomError, req: Request, res: Response, next: NextFunction): Response {
        const statusCode: number = err.status || 500;
        const message: string = err.message || 'Internal Server Error';
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
}

export default new ErrorHandler