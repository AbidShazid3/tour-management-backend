import { Router } from "express";
import { TourController } from "./tour.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

// tour
router.post('/create', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourZodSchema), TourController.createTour);
router.get('/', TourController.getAllTour);
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateTourZodSchema), TourController.updateTour);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour);

// tour types
router.post('/create-tour-type', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.createTourType);
router.get('/tour-types', TourController.getAllTourTypes);
router.patch("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.updateTourType);
router.delete('/tour-types/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType);

export const TourRoutes = router;