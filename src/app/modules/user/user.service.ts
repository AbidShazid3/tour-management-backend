import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/evn";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exist')
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = { provider: IProvider.CREDENTIALS, providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user;
};

const updatedUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const userIdExist = await User.findById(userId)
    if (!userIdExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    // if (userIdExist.isDeleted || userIdExist.isActive === isActive.BLOCKED) {
    //     throw new AppError(httpStatus.FORBIDDEN, 'This user can not authorized to update')
    // }
    // email: can not update
    // name, phone, password, address
    // password re hashing
    // only admin and super-admin: role, isDeleted
    // promoting to super-admin: only super-admin can do

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized')
        }
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized')
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized')
        }
    }

    if (payload.password) {
        const isSame = await bcryptjs.compare(payload.password, userIdExist.password || '')
        if (!isSame) {
            payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
        } else {
            delete payload.password
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser;
}

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query);
    const allUsers = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .pagination();


    const users = await allUsers.build();
    const totalUsers = await queryBuilder.getMeta();
    return {
        data: users,
        meta: totalUsers
    };
};

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
}

export const UserService = {
    createUser,
    getAllUsers,
    getMe,
    getSingleUser,
    updatedUser,
};