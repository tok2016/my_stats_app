import { SteamGamesList } from '@ts/games/game';
import { PrecisePeriod } from '@ts/games/metric';
import ErrorResponse, { ValidationIssue } from '@ts/requests';
import { Option } from '@ts/ui/components-props';
import FormState from '@ts/ui/form-state';
import { ConfirmationInfo } from '@ts/users/confirmation';
import Country from '@ts/users/country';
import { CredentialsInSchema } from '@ts/users/credentials';
import Dashboard from '@ts/users/dashboard';
import { NewPassword } from '@ts/users/password';
import { BasicUser, User, UserInfoInSchema } from '@ts/users/user';

import { isAxiosError } from './axios-instanse';

export const MILLISECONDS = 1000;
export const MINUTES = 60;
export const MONTH_IN_QUARTER = 3;
const MONTH_SHIFT = 11;

export const FOUND_USERS_LIMIT = 5;

export const CODE_LENGTH = 6;

export const CONFIRMATION_TTL = 30 * 60;

const SUCCESS_CODE_START = 200;
const SUCCESS_CODE_END = 300;

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

export const Modules = ['user', 'music', 'games'] as const;

export const defaultFormState = <FormDataType>(): FormState<FormDataType> => ({
  error: false,
  message: ''
});

export const defaultConfirmation: ConfirmationInfo = {
  isConfirmed: false,
  id: '',
  credential: '',
  action: 'password'
};

export const defaultNewPassword: NewPassword = {
  credential: '',
  operationId: '',
  password: '',
  repeatPassword: ''
};

export const defaultUser: User = {
  id: '',
  username: '',
  email: '',
  createdAt: new Date(),
  dashboards: [],
  isPublic: false
};

export const defaultCountry: Country = {
  name: '',
  flag: '',
  iso2: ''
};

export const emptyOption: Option = {
  value: '',
  label: '',
  key: ''
};

export const isErrorResponse = (value: unknown): value is ErrorResponse =>
  (value as ErrorResponse)?.message !== undefined;

export const isSteamGameObject = (value: unknown): value is SteamGamesList =>
  (value as SteamGamesList).games !== undefined;

export const isExpired = (date: Date | string | number) =>
  new Date(date) < new Date();

export const isSuccess = (status: number) =>
  status >= SUCCESS_CODE_START && status < SUCCESS_CODE_END;

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
  Math.floor(Math.random() * Math.pow(10, CODE_LENGTH)).toLocaleString(
    'en-US',
    {
      minimumIntegerDigits: CODE_LENGTH,
      useGrouping: false
    }
  );

export const generateErrorResponse = (
  status: number,
  message: string,
  issues: ValidationIssue[] = []
): ErrorResponse => ({ status, message, issues });

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};

export const getErrorFormState = <FormDataType>(
  err: unknown,
  data?: FormData
): FormState<FormDataType> => {
  if (isAxiosError(err)) {
    if (isErrorResponse(err.response?.data)) {
      return {
        error: true,
        message: err.response.data.message,
        issues: mapIssuesMessages<FormDataType>(err.response.data.issues),
        data
      };
    }

    return {
      error: true,
      message: err.message,
      data
    };
  }

  return {
    error: true,
    message: 'Something went wrong. Please, try it later',
    data
  };
};

export const mapIssuesMessages = <T>(
  issues: ValidationIssue[]
): Record<keyof T, string> => {
  const entries = [];

  for (const issue of issues) {
    for (const path of issue.path) {
      entries.push([path, issue.message]);
    }
  }

  return Object.fromEntries(entries);
};

export const getFormDataValue = (
  name: string,
  formData?: FormData
): string | undefined => formData?.get(name)?.toString() ?? undefined;

export const parseBooleanString = (value: string) => {
  const lowercase = value.toLowerCase();
  return !!value && lowercase !== 'false' && lowercase !== 'off';
};

export const getPeriodDate: Record<PrecisePeriod, (date: Date) => string> = {
  year: (date) => date.getFullYear().toString(),
  season: (date) => {
    const seasonNumber = Math.floor(
      ((date.getMonth() % MONTH_SHIFT) + 1) / MONTH_IN_QUARTER
    );
    return `${date.getFullYear()}-${seasonNumber}`;
  },
  month: (date) => `${date.getFullYear()}-${date.getMonth()}`
};

export const mean = (values: number[]) =>
  values.length > 0
    ? values.reduce((prev, curr) => prev + curr, 0) / values.length
    : undefined;
