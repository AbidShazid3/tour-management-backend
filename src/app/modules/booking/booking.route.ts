import { Router } from "express"
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";


const router = Router();

router.post('/', checkAuth(...Object.values(Role)), validateRequest(createBookingZodSchema),bookingController.createBooking);
router.get('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), bookingController.getAllBooking);
router.get('/my-bookings', checkAuth(...Object.values(Role)), bookingController.getUserBooking);
router.get('/:bookingId', checkAuth(...Object.values(Role)), bookingController.getSingleBooking);
router.patch('/:bookingId/status', checkAuth(...Object.values(Role)), validateRequest(updateBookingStatusZodSchema), bookingController.updateBookingStatus);

export const BookingRoutes = router;