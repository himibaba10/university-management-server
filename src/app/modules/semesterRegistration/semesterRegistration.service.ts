/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  //Check if there is any semester registration has the status: UPCOMING or ONGOING
  const hasAnyUpcomingOrOngoingSemesterRegistration =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.UPCOMING },
      ],
    });

  if (hasAnyUpcomingOrOngoingSemesterRegistration) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${hasAnyUpcomingOrOngoingSemesterRegistration.status} semester registration`,
    );
  }

  const academicSemester = await AcademicSemester.findById(
    payload.academicSemester,
  );

  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  const doesAcademicSemesterRegistrationExist =
    await SemesterRegistration.findOne({
      academicSemester: payload.academicSemester,
    });

  if (doesAcademicSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Semester registration already exists',
    );
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = semesterRegistrationQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const semisterRegistration = await SemesterRegistration.findById(id);

  if (semisterRegistration?.status === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This semester registration is already ended',
    );
  }
};

const deleteSemesterRegistrationFromDB = async (id: string) => {};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
