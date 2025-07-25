import { Types } from "mongoose"

export enum BookingStatus {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED",
}

export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId;
    guestCount: number;
    status: BookingStatus,
    payment?: Types.ObjectId;
}