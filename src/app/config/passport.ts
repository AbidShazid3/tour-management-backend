/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./evn";
import { User } from "../modules/user/user.model";
import { IProvider, Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email: string, password: string, done) => {
    try {
        const isUserExist = await User.findOne({ email })
        if (!isUserExist) {
            return done(null, false, { message: 'User does not exist' })
        }

        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider === IProvider.GOOGLE)
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, { message: 'You have authenticated through Google.Want to login with credentials, then login with google and set a password' })
        }

        const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)
        if (!isPasswordMatch) {
            return done(null, false, { message: 'Incorrect password' })
        }

        return done(null, isUserExist)
    } catch (error) {
        done(error)
    }
}))

passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) {
                return done(null, false, { message: 'No email found' })
            }

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [{
                        provider: IProvider.GOOGLE,
                        providerId: profile.id
                    }]
                })
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    })
)


passport.serializeUser((user: any, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})