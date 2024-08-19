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
import { RegistrationStatus } from '../semesterRegistration/semesterRegistration.constant';

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

const getOfferedCoursesFromDB = async () => {
  const result = await OfferedCourse.find();
  return result;
};

const getOfferedCourseFromDB = async (payload: string) => {
  const result = await OfferedCourse.findById(payload);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found');
  }

  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    'faculty' | 'startTime' | 'endTime' | 'days' | 'maxCapacity'
  >,
) => {
  const { faculty, startTime, endTime, days } = payload;
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(httpStatus.FORBIDDEN, 'Offered course is not found');
  }

  const semesterRegistration = await SemesterRegistration.findById(
    offeredCourse?.semesterRegistration,
  ).select('status');

  if (semesterRegistration!.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Cannot update offered course in a semester registration that is not upcoming',
    );
  }

  const doesFacultyExist = await Faculty.findById(faculty);

  if (!doesFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found.');
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

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getOfferedCoursesFromDB,
  getOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
