/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";


const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload
    const booking = await bookingService.createBooking(req.body, decodeToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking created successfully',
        data: booking
    })
})

const getAllBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await bookingService.getAllBooking();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Booking retrieved successfully',
        data: booking
    })
})
const getUserBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await bookingService.getUserBooking();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking retrieved successfully',
        data: booking
    })
})
const getSingleBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await bookingService.getSingleBooking();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking retrieved successfully',
        data: booking
    })
})
const updateBookingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await bookingService.updateBookingStatus();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking updated successfully',
        data: booking
    })
})

export const bookingController = {
    createBooking,
    getAllBooking,
    getUserBooking,
    getSingleBooking,
    updateBookingStatus,
}