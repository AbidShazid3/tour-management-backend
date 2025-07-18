/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlerDuplicateError = (error: any): TGenericErrorResponse => {
    const matchArray = error.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchArray[1]} already exists`,
    }
}