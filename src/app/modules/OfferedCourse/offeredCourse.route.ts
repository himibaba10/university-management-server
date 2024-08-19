import { Router } from 'express';
import { offeredCourseControllers } from './offeredCourse.controller';
import { offeredCourseValidations } from './offeredCourse.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get('/', offeredCourseControllers.getOfferedCourses);
router.get('/:id', offeredCourseControllers.getOfferedCourse);

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

export const OfferedCourseRoutes = router;
