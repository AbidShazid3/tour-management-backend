/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/evn"
import AppError from "../errorHelpers/AppError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerCastError } from "../helpers/handleCastError";
import { handlerZodError } from "../helpers/handlerZodError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { TErrorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async(error: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error);
    }

    if (req.file) {
        await deleteImageFromCloudinary(req.file.path)
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrl = (req.files as Express.Multer.File[]).map(file => file.path)
        await Promise.all(imageUrl.map(url => deleteImageFromCloudinary(url)))
    }

    let errorSources: TErrorSources[] = []
    let statusCode = 500;
    let message = 'Something went wrong'

    if (error.code === 11000) {
        const simplifiedError = handlerDuplicateError(error)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    } else if (error.name === 'CastError') {
        const simplifiedError = handlerCastError(error)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    } else if (error.name === "ZodError") {
        const simplifiedError = handlerZodError(error)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    } else if (error.name === 'ValidationError') {
        const simplifiedError = handlerValidationError(error)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
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
        error: envVars.NODE_ENV === 'development' ? error : null,
        stack: envVars.NODE_ENV === 'development' ? error.stack : null
    })
}