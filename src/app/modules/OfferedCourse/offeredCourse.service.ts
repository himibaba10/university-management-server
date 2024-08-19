import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import OfferedCourse from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../Faculty/faculty.model';
import { Course } from '../Course/course.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    academicDepartment,
    academicFaculty,
    course,
    section,
    faculty,
    semesterRegistration,
    days,
    startTime,
    endTime,
  } = payload;

  const doesSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!doesSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found.',
    );
  }

  const doesAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);

  if (!doesAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty is not found.');
  }

  const doesAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);

  if (!doesAcademicDepartmentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic department is not found.',
    );
  }

  const doesFacultyExist = await Faculty.findById(faculty);

  if (!doesFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found.');
  }

  const doesCourseExist = await Course.findById(course);

  if (!doesCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found.');
  }

  const facultyOfAcademicDepartment =
    doesAcademicDepartmentExist.academicFaculty;

  if (
    doesAcademicFacultyExist._id.toString() !==
    facultyOfAcademicDepartment.toString()
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The ${doesAcademicDepartmentExist.name} does not exist on the ${doesAcademicFacultyExist.name}`,
    );
  }

  const alreadyHasSectionInTheSemester = await OfferedCourse.findOne({
    academicSemester: doesSemesterRegistrationExist.academicSemester,
    course,
    section,
  });

  if (alreadyHasSectionInTheSemester) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Offered course already exists in the same section',
    );
  }

  const schedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = { startTime, endTime };

  if (hasTimeConflict(schedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Time does not available! Choose another time',
    );
  }

  payload.academicSemester = doesSemesterRegistrationExist.academicSemester;

  const result = await OfferedCourse.create(payload);
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
};
