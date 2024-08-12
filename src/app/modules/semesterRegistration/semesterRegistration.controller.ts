import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { semesterRegistrationServices } from './semesterRegistration.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationServices.createSemesterRegistrationIntoDB(
        req.body,
      );

    sendResponse(res, {
      data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: 'Created semester registration successfully',
    });
  },
);

const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationServices.getAllSemesterRegistrationsFromDB(
        req.query,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Semester registrations retrieved successfully',
      data: result,
    });
  },
);

const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {},
);

const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {},
);

const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {},
);

export const semesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
