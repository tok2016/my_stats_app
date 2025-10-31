import z from 'zod';

import { NewDashboard } from '@ts/users/dashboard';
import { UserLogin, UserUpdate } from '@ts/users/user';
import { NewService } from '@ts/users/service';
import { NewCredentials } from '@ts/users/credentials';
import Password, { NewPassword, PasswordUpdate } from '@ts/users/password';

import {
  ConfirmationActions,
  DashboardTypes,
  generateErrorResponse,
  ServiceNames,
  ServiceStatuses
} from './utils';
import { ConfirmationCode, NewConfirmation } from '@ts/users/confirmation';

const MIN_USERNAME_LENGTH = 8;
const MAX_USERNAME_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

const PasswordValidator: z.ZodType<Password> = z
  .object({
    password: z
      .string()
      .trim()
      .nonempty()
      .regex(/[a-zA-Z]+/g)
      .regex(/\d+/g)
      .regex(/[?!#+-@$&*]*/g)
      .min(PASSWORD_MIN_LENGTH)
      .max(PASSWORD_MAX_LENGTH),
    repeatPassword: z.string().trim().nonempty()
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: `Passwords don't match`,
    path: ['repeatPassword']
  });

export const CredentialsValidator: z.ZodType<NewCredentials> =
  PasswordValidator.and(
    z.object({
      email: z.email().nonempty(),
      username: z
        .string()
        .nonempty()
        .min(MIN_USERNAME_LENGTH)
        .max(MAX_USERNAME_LENGTH)
    })
  );

export const DashboardValidator: z.ZodType<NewDashboard> = z.object({
  object: z.string().nonempty(),
  type: z.enum(DashboardTypes).default('text'),
  x: z.number().default(0),
  y: z.number().default(0),
  width: z.number().default(0),
  height: z.number().default(0),
  service: z.enum(ServiceNames).default('spotify')
});

export const UserUpdateValidator: z.ZodType<UserUpdate> = z
  .object({
    email: z.email().optional(),
    avatarUrl: z.url().optional().nullable(),
    birthdate: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    isPublic: z.boolean().default(false),
    unblockDate: z.string().optional().nullable()
  })
  .transform((input) => ({
    ...input,
    birthdate: input.birthdate ? new Date(input.birthdate) : undefined,
    unblockDate: input.unblockDate ? new Date(input.unblockDate) : undefined
  }));

export const UserLoginValidator: z.ZodType<UserLogin> = z.object({
  credential: z.string().nonempty(),
  password: z.string().trim().nonempty()
});

export const ServiceValidator: z.ZodType<NewService> = z.object({
  name: z.enum(ServiceNames).default('spotify'),
  login: z.string().nonempty(),
  status: z.enum(ServiceStatuses).default('unknown')
});

export const PasswordUpdateValidator: z.ZodType<PasswordUpdate> =
  PasswordValidator.and(
    z.object({
      oldPassword: z.string().trim().nonempty()
    })
  );

export const NewConfirmationValidator: z.ZodType<NewConfirmation> = z.object({
  credential: z.string().nonempty(),
  action: z.enum(ConfirmationActions).default('password')
});

export const ConfirmationCodeValidator: z.ZodType<ConfirmationCode> =
  NewConfirmationValidator.and(
    z.object({
      id: z.string().nonempty(),
      code: z.string().nonempty()
    })
  );

export const NewPasswordValidatior: z.ZodType<NewPassword> =
  PasswordValidator.and(
    z.object({
      credential: z.string().nonempty(),
      operationId: z.string().nonempty()
    })
  );

export const validateData = async <
  DataType,
  ValidatorType extends z.ZodType = z.ZodType<DataType>
>(
  validator: ValidatorType,
  data: unknown
) => {
  const validated = await validator.safeParseAsync(data);

  if (!validated.success) {
    throw generateErrorResponse(400, 'Invalid data', validated.error.issues);
  }

  return validated.data;
};
