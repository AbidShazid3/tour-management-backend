import { model, Schema } from "mongoose";
import { IAuthProvider, isActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, { _id: false, versionKey: false })

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    phone: { type: String, trim: true, },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(isActive),
        default: isActive.ACTIVE
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
    // bookings: [{type: Schema.Types.ObjectId,ref: 'Booking'}],
    // guides: [{type: Schema.Types.ObjectId,ref: 'Guides'}]

}, { timestamps: true, versionKey: false })

export const User = model<IUser>('User', userSchema);