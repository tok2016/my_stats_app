import z from 'zod';

import { NewDashboard } from '@ts/users/dashboard';
import { UserLogin, UserUpdate } from '@ts/users/user';
import { NewService } from '@ts/users/service';
import { NewCredentials } from '@ts/users/credentials';
import PasswordUpdate, { NewPassword } from '@ts/users/password';

import {
  ConfirmationActions,
  DashboardTypes,
  ServiceNames,
  ServiceStatuses
} from './utils';
import { ConfirmationCode, NewConfirmation } from '@ts/users/confirmation';

const MIN_USERNAME_LENGTH = 8;
const MAX_USERNAME_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

export const CredentialsValidator: z.ZodType<NewCredentials> = z.object({
  email: z.email().nonempty(),
  username: z
    .string()
    .nonempty()
    .min(MIN_USERNAME_LENGTH)
    .max(MAX_USERNAME_LENGTH),
  password: z
    .string()
    .nonempty()
    .regex(/[a-zA-Z]+/g)
    .regex(/\d+/g)
    .regex(/[?!#+-@$&*]*/g)
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
});

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
  password: z.string().nonempty()
});

export const ServiceValidator: z.ZodType<NewService> = z.object({
  name: z.enum(ServiceNames).default('spotify'),
  login: z.string().nonempty(),
  status: z.enum(ServiceStatuses).default('unknown')
});

export const PasswordUpdateValidator: z.ZodType<PasswordUpdate> = z.object({
  old: z.string().nonempty(),
  new: z.string().nonempty()
});

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
  UserLoginValidator.and(z.object({ operationId: z.string().nonempty() }));
