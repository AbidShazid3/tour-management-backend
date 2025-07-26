/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { TourService } from "./tour.service"
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { ITour } from "./tour.interface";

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
        images: (req.files as Express.Multer.File[]).map(file => file.path),
        ...req.body
    }
    const tour = await TourService.createTour(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour created successfully',
        data: tour
    })
})

const getAllTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await TourService.getAllTour(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Tour retrieved successfully',
        data: result.data,
        meta: result.meta
    })
})
const getSingleTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug
    const result = await TourService.getSingleTour(slug)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour retrieved successfully',
        data: result,
    })
})

const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let imageUrls: string[] = [];

    // ✅ Check if files exist
    if (req.files && Array.isArray(req.files)) {
        imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
    }
    const payload: Partial<ITour> = {
        ...req.body,
        ...(imageUrls.length > 0 && { images: imageUrls })
    }
    const result = await TourService.updateTour(id, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour updated successfully',
        data: result
    })
});

const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await TourService.deleteTour(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour deleted successfully',
        data: result
    })
});

// tour-types
const createTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.createTourType(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour Type created successfully',
        data: tourType
    })
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await TourService.getAllTourTypes(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Tour Types retrieved successfully',
        data: result.data,
        meta: result.meta
    })
});

const getSingleTourTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await TourService.getSingleTourType(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour Type retrieved successfully',
        data: result,
    })
});

const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await TourService.updateTourType(id, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour Type updated successfully',
        data: result
    })
});

const deleteTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await TourService.deleteTourType(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour Type deleted successfully',
        data: result
    })
});

export const TourController = {
    createTour,
    getAllTour,
    getSingleTour,
    updateTour,
    deleteTour,
    createTourType,
    getAllTourTypes,
    getSingleTourTypes,
    updateTourType,
    deleteTourType
}