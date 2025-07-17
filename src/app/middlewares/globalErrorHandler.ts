/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/evn"
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const errorSources: any = []
    let statusCode = 500;
    let message = 'Something went wrong'

    if (error.code === 11000) {
        const matchArray = error.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchArray[1]} already exists`;
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid mongoDB object id. Pls provide a valid id'
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(error.errors)
        
        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        message = 'Validation error occurred'
    } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message
    } else if (error instanceof Error) {
        statusCode = 500
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // error,
        stack: envVars.NODE_ENV === 'development' ? error.stack : null
    })
}