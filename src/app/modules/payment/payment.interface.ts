/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELED = "CANCELED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export interface IPayment {
    booking: Types.ObjectId;
    transactionId: string;
    status: PaymentStatus;
    amount: number;
    paymentGatewayData?: any;
    invoiceUrl?: string;

}