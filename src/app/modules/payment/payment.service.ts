import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";


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
    successPayment,
    failPayment,
    cancelPayment,
}