import path from 'path';

import { CredentialsInSchema } from '@ts/users/credentials';
import { BasicUser, User, UserInfoInSchema } from '@ts/users/user';
import Dashboard from '@ts/users/dashboard';
import ErrorResponse, { ValidationIssue } from '@ts/ui/from-state';
import { NextResponse } from 'next/server';

export const AVATAR_DIRECTORY = path.join(process.cwd(), 'avatars');

export const MILLISECONDS = 1000;

export const FOUND_USERS_LIMIT = 5;

const SIX_CODE_MULT = 1000000;

const ERROR_START_CODE = 400;

export const DashboardTypes = ['metric', 'media', 'text'] as const;

export const ServiceNames = ['spotify', 'steam'] as const;

export const ConfirmationActions = ['password', 'delete'] as const;

export const ServiceStatuses = [
  'authorized',
  'unauthorized',
  'notRequired',
  'error',
  'unknown'
] as const;

export const ButtonVariants = ['primary', 'secondary', 'outlined'] as const;

export const InputThemes = ['light', 'dark'] as const;

export const SelectVariants = ['plain', 'text'] as const;

export const Modules = ['user', 'music', 'games'] as const;

export const defaultFormState: ErrorResponse = {
  status: 100,
  message: '',
  issues: []
};

export const isErrorResponse = (value: unknown): value is ErrorResponse =>
  (value as ErrorResponse).message !== undefined;

export const isExpired = (date: Date | string | number) =>
  new Date(date) < new Date();

export const uniteBasicUserData = (
  credentials: CredentialsInSchema,
  userInfo: UserInfoInSchema
): BasicUser => ({
  ...credentials,
  ...userInfo,
  id: userInfo._id.toString()
});

export const uniteUserData = (
  credentials: CredentialsInSchema,
  userInfo: UserInfoInSchema,
  dashboards: Dashboard[]
): User => ({
  ...uniteBasicUserData(credentials, userInfo),
  dashboards
});

export const generateCode = () =>
  Math.floor(Math.random() * SIX_CODE_MULT).toString();

export const generateErrorResponse = (
  status: number,
  message: string,
  issues: ValidationIssue[] = []
): ErrorResponse => ({ status, message, issues });

export const responseWithError = (
  status: number,
  message: string,
  issues: ValidationIssue[] = []
): NextResponse<ErrorResponse> =>
  NextResponse.json(generateErrorResponse(status, message, issues), {
    status,
    statusText: message
  });

export const getIconCode = (iconName: string) => `mynaui:${iconName}`;

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};

export const isErrorCode = (statusCode: number) =>
  statusCode < ERROR_START_CODE;
