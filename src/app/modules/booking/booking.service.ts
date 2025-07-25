/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes';
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PaymentStatus } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId();

    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(userId).session(session);
        if (!user?.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Pls update your profile with phone or address')
        }

        const tour = await Tour.findById(payload.tour).select('costFrom').session(session)
        if (!tour?.costFrom) {
            throw new AppError(httpStatus.BAD_REQUEST, 'No tour cost found!')
        }

        if (!payload.guestCount) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid guest number!')
        }

        const amount = Number(tour.costFrom) * Number(payload.guestCount)

        const booking = await Booking.create([{
            user: userId,
            status: BookingStatus.PENDING,
            ...payload
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PaymentStatus.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        const updatedBooking = await Booking.
            findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate('user', 'name email phone address')
            .populate('tour', 'title costFrom')
            .populate('payment');

        const userAddress = (updatedBooking?.user as any).address;
        const userEmail = (updatedBooking?.user as any).email;
        const userPhone = (updatedBooking?.user as any).phone;
        const userName = (updatedBooking?.user as any).name;
        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhone,
            name: userName,
            amount: amount,
            transactionId: transactionId
        }
        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        await session.commitTransaction();

        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking,
        };
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
}

const getAllBooking = async () => {

    return {}
}

const getUserBooking = async () => {

    return {}
}

const getSingleBooking = async () => {

    return {}
}

const updateBookingStatus = async () => {

    return {}
}

export const bookingService = {
    createBooking,
    getAllBooking,
    getUserBooking,
    getSingleBooking,
    updateBookingStatus,
}