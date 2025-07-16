import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./evn";
import { User } from "../modules/user/user.model";
import { IProvider, Role } from "../modules/user/user.interface";


passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) {
                return done(null, false, {message: 'No email found'})
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
            console.log("google strategy error", error);
            return done(error)
        }
    })
)

// req
// frontend localhost: 5173 --> localhost:5000/api/v1/auth/google
// then passport --> google oauth consent(google login popup) --> gmail login --> successful
// then redirect to callback localhost:5000/api/v1/auth/google/callback
// successfully login then Jwt token: role, email ... save data to db store --> give token

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})