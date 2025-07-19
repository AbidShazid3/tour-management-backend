import AppError from "../../errorHelpers/AppError";
import { ITour, ITourTypes } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from 'http-status-codes';

const createTour = async (payload: ITour) => {
    const isExistTour = await Tour.findOne({ title: payload.title })
    if (isExistTour) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Tour with this title already exist')
    }

    const baseSlug = payload.title.toLowerCase().split(' ').join('-') + '-division';
    let slug = baseSlug;
    let counter = 1;
    while (await Tour.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }
    payload.slug = slug;

    const tour = await Tour.create(payload);
    return tour
}

const getAllTour = async () => {
    const tour = await Tour.find({})
    const totalTour = await Tour.countDocuments();
    return {
        data: tour,
        meta: {
            total: totalTour
        }
    };
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const isExistTour = await Tour.findById(id)
    if (!isExistTour) {
        throw new AppError(httpStatus.NOT_FOUND, 'Tour does not exist')
    }

    if (payload.title && payload.title !== isExistTour.title) {
        const baseSlug = payload.title.toLowerCase().split(' ').join('-') + '-division';
        let slug = baseSlug;
        let counter = 1;
        while (await Tour.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        payload.slug = slug;
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload,{new: true, runValidators: true});
    return updatedTour
}
const deleteTour = async (id: string) => {
    const isExistTour = await Tour.findById(id)
    if (!isExistTour) {
        throw new AppError(httpStatus.NOT_FOUND, 'Tour does not exist')
    }

    await Tour.findByIdAndDelete(id);
    return null
}

// tour-type
const createTourType = async (payload: ITourTypes) => {
    const isExistTour = await Tour.findOne({ name: payload.name })
    if (isExistTour) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Tour Type with this name already exist')
    }

    const tourType = await TourType.create(payload);
    return tourType
};

const getAllTourTypes = async () => {
    const tourTypes = await TourType.find({})
    return tourTypes;
};

const updateTourType = async (id: string, payload: Partial<ITourTypes>) => {
    const isExistTour = await TourType.findById(id)
    if (!isExistTour) {
        throw new AppError(httpStatus.NOT_FOUND, 'Tour Type does not exist')
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return updatedTourType
};

const deleteTourType = async (id: string) => {
    const isExistTour = await TourType.findById(id)
    if (!isExistTour) {
        throw new AppError(httpStatus.NOT_FOUND, 'Tour Type does not exist')
    }

    await TourType.findByIdAndDelete(id);
    return null
}


export const TourService = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour,
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
}