import z from 'zod';

import { UserUpdate } from '@ts/users/user-update';
import Dashboard from '@ts/users/dashboard';
import NewCredentials from '@ts/users/new-credentials';
import UserLogin from '@ts/users/user-login';

import { DashboardTypes, ServiceNames } from './utils';

const MIN_USERNAME_LENGTH = 8;
const MAX_USERNAME_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

const MAX_DAHSBOARD_ITEMS = 6;

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

export const DashboardValidator: z.ZodType<Dashboard> = z.object({
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
    dashboards: z
      .array(DashboardValidator)
      .max(MAX_DAHSBOARD_ITEMS)
      .default([]),
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
