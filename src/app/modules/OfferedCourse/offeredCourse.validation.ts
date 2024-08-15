import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicSemester: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number().int().positive(),
    section: z.number().int().positive(),
    days: z.enum([...Days] as [string, ...string[]]),
    startTime: z.date(),
    endTime: z.date(),
  }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().int().positive().optional(),
    section: z.number().int().positive().optional(),
    days: z.enum([...Days] as [string, ...string[]]).optional(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
  }),
});

export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
