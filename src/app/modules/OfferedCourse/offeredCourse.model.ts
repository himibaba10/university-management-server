import { model, Schema } from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { Days } from './offeredCourse.constant';
import { TOfferedCourse } from './offeredCourse.interface';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: SemesterRegistration,
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: AcademicSemester,
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: AcademicFaculty,
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: AcademicDepartment,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: Course,
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: Faculty,
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    days: {
      type: String,
      enum: Days,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const OfferedCourse = model<TOfferedCourse>(
  'offeredCourse',
  offeredCourseSchema,
);

export default OfferedCourse;
