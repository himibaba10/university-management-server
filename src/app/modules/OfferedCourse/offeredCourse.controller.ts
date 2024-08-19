import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.createOfferedCourseIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course created successfully',
    data: result,
  });
});

const getOfferedCourses = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.getOfferedCoursesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered courses are fetched successfully',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.updateOfferedCourseIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered course updated successfully',
    data: result,
  });
});

export const offeredCourseControllers = {
  createOfferedCourse,
  getOfferedCourses,
  updateOfferedCourse,
};
