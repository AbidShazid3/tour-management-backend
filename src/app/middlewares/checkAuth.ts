import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/evn";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, 'No token received')
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        // authRoles = ["ADMIN", "SUPER_ADMIN"].includes()
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, 'You are not permitted to access it')
        }
        req.user = verifiedToken;

        next();
    } catch (error) {
        next(error)
    }
}