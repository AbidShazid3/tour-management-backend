/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from 'http-status-codes';

const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "payment not found. You have not booked this tour")
    }
    const booking = await Booking.findById(payment.booking)
    const userAddress = (booking?.user as any).address;
    const userEmail = (booking?.user as any).email;
    const userPhone = (booking?.user as any).phone;
    const userName = (booking?.user as any).name;
    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhone,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }
    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
    }
};

const successPayment = async (query: Record<string, string>) => {
    // update payment status to paid
    // update booking status to confirm
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PaymentStatus.PAID },
            { new: true, runValidators: true, session });

        await Booking.findByIdAndUpdate(updatePayment?.booking,
            { status: BookingStatus.COMPLETE },
            { runValidators: true, session })

        await session.commitTransaction();
        return { success: true, message: 'Payment completed successfully' }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const failPayment = async (query: Record<string, string>) => {
    // update payment status to paid
    // update booking status to confirm
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PaymentStatus.FAILED },
            { new: true, runValidators: true, session });

        await Booking.findByIdAndUpdate(updatePayment?.booking,
            { status: BookingStatus.FAILED },
            { runValidators: true, session })

        await session.commitTransaction();
        return { success: false, message: 'Payment failed' }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    // update payment status to paid
    // update booking status to confirm
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PaymentStatus.CANCELED },
            { new: true, runValidators: true, session });

        await Booking.findByIdAndUpdate(updatePayment?.booking,
            { status: BookingStatus.CANCEL },
            { runValidators: true, session })

        await session.commitTransaction();
        return { success: false, message: 'Payment canceled' }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
}