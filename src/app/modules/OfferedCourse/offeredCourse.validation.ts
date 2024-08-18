import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number().int().positive(),
    section: z.number().int().positive(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    startTime: z.string().refine(
      (val) => {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(val);
      },
      {
        message: 'Invalid time format. Please use HH:MM (24-hour) format.',
      },
    ),
    endTime: z.string().refine(
      (val) => {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(val);
      },
      {
        message: 'Invalid time format. Please use HH:MM (24-hour) format.',
      },
    ),
  }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().int().positive().optional(),
    section: z.number().int().positive().optional(),
    days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
  }),
});

export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
