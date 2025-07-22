import { model, Schema } from "mongoose";
import { BookingStatus, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: "Tour",
        required: true
    },
    guestCount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(BookingStatus),
        default: BookingStatus.PENDING
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
    },
}, { timestamps: true, versionKey: false })

export const Booking = model<IBooking>("Booking", bookingSchema)