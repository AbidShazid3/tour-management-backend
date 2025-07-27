/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/evn";
import { IAuthProvider, IProvider, isActive } from "../user/user.interface";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;

//     const isUserExist = await User.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Email does not exist')
//     }

//     const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)
//     if (!isPasswordMatch) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect Password')
//     }

//     const userToken = createUserToken(isUserExist);

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject();

//     return {
//         accessToken: userToken.accessToken,
//         refreshToken: userToken.refreshToken,
//         user: rest,
//     }
// };

const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    }
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Old password does not match')
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found')
    }
    if (user.password && user.auths.some(providerObject => providerObject.provider === IProvider.GOOGLE)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You have already set your password.Now you can change your password from your profile password update')
    }

    const hashPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))

    const auths: IAuthProvider[] = [...user.auths, { provider: IProvider.CREDENTIALS, providerId: user.email }]

    user.password = hashPassword;
    user.auths = auths;

    await user.save();
}

const forgetPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist')
    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is not verified')
    }
    if (isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted')
    }

    const JwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: '10m'
    });

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

    await sendEmail({
        to: isUserExist.email,
        subject: "Password reset",
        templateName: 'forgetPassword',
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })
};

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id !== decodedToken.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You can not reset password')
    }
    if (!payload.password || payload.password.length < 6) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Password must be at least 6 characters long')
    }
    const isUserExist = await User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist')
    }

    const hashPassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))

    isUserExist.password = hashPassword;
    await isUserExist.save();

};

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword,
}