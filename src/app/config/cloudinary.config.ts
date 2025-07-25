/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './evn';
import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});

export const deleteImageFromCloudinary = async (url: string) => {
    try {
        // https://res.cloudinary.com/df2pwujqy/image/upload/v1753474395/2hjmf89d06t-1753474390644-sylhet-tea-garden.jpg
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
        }
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, 'cloudinary image deletion failed', error.message)
    }
}

export const cloudinaryUpload = cloudinary;