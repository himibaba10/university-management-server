import express from 'express';
import { authValidations } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authControllers } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

export const AuthRoutes = router;
