import z from 'zod';

const MIN_USERNAME_LENGTH = 8;
const MAX_USERNAME_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

export const CredentialsValidator = z.object({
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
