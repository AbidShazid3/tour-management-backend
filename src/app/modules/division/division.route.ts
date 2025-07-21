import { Router } from "express";
import { DivisionController } from "./division.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post('/create', validateRequest(createDivisionZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.createDivision);
router.get('/', DivisionController.getAllDivision);
router.get('/:slug', DivisionController.getSingleDivision);
router.patch('/:id', validateRequest(updateDivisionZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.updateDivision);
router.delete('/:id',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)

export const DivisionRoutes = router;