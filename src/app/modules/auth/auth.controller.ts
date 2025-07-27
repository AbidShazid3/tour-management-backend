/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserToken } from "../../utils/userTokens"
import { envVars } from "../../config/evn"
import passport from "passport"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
    // setAuthCookie(res, loginInfo);
    // res.cookie('accessToken', loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    // res.cookie('refreshToken', loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: 'User logged in successfully',
    //     data: {},
    // })

    passport.authenticate('local', async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(httpStatus.UNAUTHORIZED, err || 'Authentication error'))
        }

        if (!user) {
            return next(new AppError(httpStatus.UNAUTHORIZED, info?.message || 'Invalid credentials'))
        }

        const userToken = createUserToken(user)
        const { password: pass, ...rest } = user.toObject();
        setAuthCookie(res, userToken);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User logged in successfully',
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            },
        })
    })(req, res, next)
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No refresh token received from cookies')
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'New access token retrieved successfully',
        data: tokenInfo,
    })
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logout successfully',
        data: null,
    })
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password changed successfully',
        data: null,
    })
});

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const {password} = req.body;
    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password set successfully',
        data: null,
    })
});

const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthServices.forgetPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Mail send successfully. Check your email',
        data: null,
    })
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password changed successfully',
        data: null,
    })
});

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : '';
    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
});

export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword,
    googleCallbackController,
}