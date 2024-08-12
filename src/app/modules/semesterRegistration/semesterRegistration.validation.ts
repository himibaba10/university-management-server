import { z } from 'zod';

const createsemesterRegistrationValidationschema = z.object({
  body: z.object({}),
});

const upadatesemesterRegistrationValidationschema = z.object({
  body: z.object({}),
});

export const semesterRegistrationValidations = {
  createsemesterRegistrationValidationschema,
  upadatesemesterRegistrationValidationschema,
};
