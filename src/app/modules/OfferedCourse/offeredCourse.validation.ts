import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const checkTimeType = (val: string) => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(val);
};

const checkIfStartTimeIsLargerThanEndTime = (
  body: Partial<{
    semesterRegistration: string;
    academicFaculty: string;
    academicDepartment: string;
    course: string;
    faculty: string;
    maxCapacity: number;
    section: number;
    days: string[];
    startTime: string;
    endTime: string;
  }>,
) => {
  //map(Number) returns strings as numbers! Awesome
  const [startHour, startMin] = body.startTime!.split(':').map(Number);
  const [endHour, endMin] = body.endTime!.split(':').map(Number);

  return startHour < endHour || (startHour === endHour && startMin <= endMin);
};

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      section: z.number().int().positive(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(checkTimeType, {
        message: 'Invalid time format. Please use HH:MM (24-hour) format.',
      }),
      endTime: z.string().refine(checkTimeType, {
        message: 'Invalid time format. Please use HH:MM (24-hour) format.',
      }),
    })
    .refine(checkIfStartTimeIsLargerThanEndTime, {
      message: 'End time must be greater than start time',
    }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(checkTimeType, {
        message: 'Invalid time format. Please use HH:MM (24-hour) format.',
      }),
      endTime: z.string().refine(checkTimeType, {
        message: 'Invalid time format. Please use HH:MM (24-hour) format.',
      }),
    })
    .refine(checkIfStartTimeIsLargerThanEndTime, {
      message: 'End time must be greater than start time',
    }),
});

export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
