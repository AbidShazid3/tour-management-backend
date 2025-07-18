import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from 'http-status-codes';

const createDivision = async (payload: IDivision) => {
    const isExistDivision = await Division.findOne({ name: payload.name })
    if (isExistDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, 'A Division name already exist')
    }

    const baseSlug = payload.name.toLowerCase().split(' ').join('-') + '-division';
    let slug = baseSlug;
    let counter = 1;
    while (await Division.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }
    payload.slug = slug;

    const division = await Division.create(payload)
    return division;
}

const getAllDivision = async () => {
    const division = await Division.find({})
    const totalDivision = await Division.countDocuments();
    return {
        data: division,
        meta: {
            total: totalDivision
        }
    };
}
const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({slug})
    return {
        data: division
    };
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    const isExistDivision = await Division.findById(id)
    if (!isExistDivision) {
        throw new AppError(httpStatus.NOT_FOUND, 'Division not found')
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id }
    })
    if (duplicateDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, 'A division with this name already exists.')
    }

    if (payload.name && payload.name !== isExistDivision.name) {
        const baseSlug = payload.name.toLowerCase().split(' ').join('-') + '-division';
        let slug = baseSlug;
        let counter = 1;
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        payload.slug = slug;
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, {new: true, runValidators: true})
    return updatedDivision;
}
const deleteDivision = async (id: string) => {
    const isExistDivision = await Division.findById(id)
    if (!isExistDivision) {
        throw new AppError(httpStatus.NOT_FOUND, 'Division not found')
    }

    await Division.findByIdAndDelete(id)
    return null;
}

export const DivisionServices = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,
}