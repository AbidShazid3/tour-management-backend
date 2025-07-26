/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/evn";
import { IAuthProvider, IProvider } from "../user/user.interface";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    return {}
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

const forgetPassword = async () => {

    return{}
}

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword,
}