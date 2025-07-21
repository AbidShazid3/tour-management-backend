import AppError from "../../errorHelpers/AppError";
import { ITour, ITourTypes } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from 'http-status-codes';
import { tourSearchableFields, tourTypeSearchableFields } from "./tour.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createTour = async (payload: ITour) => {
    const isExistTour = await Tour.findOne({ title: payload.title })
    if (isExistTour) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Tour with this title already exist')
    }

    // const baseSlug = payload.title.toLowerCase().split(' ').join('-');
    // let slug = baseSlug;
    // let counter = 1;
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug;


    const tour = await Tour.create(payload);
    return tour
}

// const getAllTour = async (query: Record<string, string>) => {
//     const { searchTerm, page = 1, limit = 10, sort = 'createdAt', fields, ...filters } = query;

//     const numericPage = Number(page);
//     const numericLimit = Number(limit);
//     const skip = (numericPage - 1) * numericLimit

//     const searchCondition = searchTerm ? {
//         $or: tourSearchableFields.map(field => ({
//             [field]: { $regex: searchTerm, $options: 'i' }
//         }))
//     } : {}

//     const hasSearch = Object.keys(searchCondition).length > 0;
//     const hasFilter = Object.keys(filters).length > 0;

//     const finalQuery = hasSearch && hasFilter ? { $and: [searchCondition, filters] } : hasSearch ? searchCondition : hasFilter ? filters : {};

//     const selectedFields = fields ? fields.split(',').join(' ') : ''

//     const tour = await Tour.find(finalQuery).sort(sort).select(selectedFields).skip(skip).limit(numericLimit)

//     const totalTour = await Tour.countDocuments(finalQuery);
//     const metaData = {
//             page: numericPage,
//             limit: numericLimit,
//             total: totalTour,
//             totalPage: Math.ceil(totalTour / numericLimit)
//         }

//     return {
//         data: tour,
//         meta: metaData
//     };
// }

const getAllTour = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query);

    const tours = queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .pagination()

    const allTours = await tours.build();
    const meta = await queryBuilder.getMeta();

    return {
        data: allTours,
        meta
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

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
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

const getAllTourTypes = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(TourType.find(), query);

    const tourTypes = queryBuilder
        .search(tourTypeSearchableFields)
        .filter()
        .sort()
        .fields()
        .pagination()

    const allTourTypes = await tourTypes.build();
    const meta = await queryBuilder.getMeta();

    return {
        data: allTourTypes,
        meta
    };
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