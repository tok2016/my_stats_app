import z from 'zod';

import { GameUpdate, NewGame } from '@ts/games/game';
import { ConfirmationCode, NewConfirmation } from '@ts/users/confirmation';
import { NewCredentials } from '@ts/users/credentials';
import Password, { NewPassword, PasswordUpdate } from '@ts/users/password';
import { NewService } from '@ts/users/service';
import { UserLogin, UserUpdate } from '@ts/users/user';

import { MetricsId } from './metrics/metrics-id';
import {
  ConfirmationActions,
  ServiceNames,
  generateErrorResponse
} from './utils';

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

export const UserUpdateValidator: z.ZodType<UserUpdate> = z.object({
  email: z.email().optional(),
  birthdate: z.string().nullish().default(null),
  country: z.string().nullish().default(null),
  isPublic: z.boolean().default(false),
  unblockDate: z.string().nullish().default(null),
  metrics: z.array(z.enum(MetricsId)).optional()
});

export const UserLoginValidator: z.ZodType<UserLogin> = z.object({
  credential: z.string().nonempty(),
  password: z.string().trim().nonempty()
});

export const ServiceValidator: z.ZodType<NewService> = z.object({
  name: z.enum(ServiceNames).default('steam'),
  login: z.string().nonempty()
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

export const NewGameValidator: z.ZodType<NewGame> = z.object({
  name: z.string().nonempty(),
  apiId: z.number().nonnegative().nonoptional(),
  storeId: z.number().nonnegative().optional(),
  platformId: z.number().nonnegative().nonoptional(),
  developersIds: z
    .array(z.number().nonnegative().nonoptional())
    .optional()
    .default([]),
  publishersIds: z
    .array(z.number().nonnegative().nonoptional())
    .optional()
    .default([]),
  genresIds: z
    .array(z.number().nonnegative().nonoptional())
    .optional()
    .default([]),
  hours: z.number().nonnegative().optional().default(0),
  rating: z.number().nonnegative().optional(),
  releasedAt: z.string().optional(),
  playDate: z.string().optional(),
  coverId: z.string().optional()
});

export const GameUpdateValidator: z.ZodType<GameUpdate> = z.object({
  hours: z.number().nonnegative().optional().default(0),
  rating: z.number().nonnegative().optional(),
  playDate: z.string().optional(),
  platformId: z.number().nonnegative().nonoptional()
});

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
