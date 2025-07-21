/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionServices.createDivision(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Division created successfully',
        data: division,
    })
})
const getAllDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await DivisionServices.getAllDivision(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Division retrieved successfully',
        data: result.data,
        meta: result.meta
    })
})
const getSingleDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = await DivisionServices.getSingleDivision(slug)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single Division retrieved successfully',
        data: result.data
    })
})
const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const result = await DivisionServices.updateDivision(id, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Division updated successfully',
        data: result
    })
})
const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const result = await DivisionServices.deleteDivision(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Division deleted successfully',
        data: result
    })
})

export const DivisionController = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,
}