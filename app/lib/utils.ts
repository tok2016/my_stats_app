import { PrecisePeriod } from '@ts/games/metric';
import ErrorResponse, { ValidationIssue } from '@ts/requests';
import { Option, PathInfo } from '@ts/ui/components-props';
import FormState from '@ts/ui/form-state';
import { ConfirmationInfo } from '@ts/users/confirmation';
import Country from '@ts/users/country';
import { CredentialsInSchema } from '@ts/users/credentials';
import Dashboard from '@ts/users/dashboard';
import { NewPassword } from '@ts/users/password';
import { BasicUser, User, UserInfoInSchema } from '@ts/users/user';

import { isAxiosError, isErrorResponse } from './type-guards';

export const MILLISECONDS = 1000;
export const MINUTES = 60;
export const MONTHS_IN_QUARTER = 3;
export const MONTHS_IN_YEAR = 12;
const MONTHS_SHIFT = 11;

export const FOUND_USERS_LIMIT = 5;

export const CODE_LENGTH = 6;

export const CONFIRMATION_TTL = 30 * 60;

export const TOP_ENTRIES = 3;
export const GAMES_IN_METRIC = 5;
export const ITEMS_IN_RATING = 5;

export const MAX_ENTRIES_IN_CHART = 10;
export const MIN_PERCENT_FOR_CHART = 2;

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

export const Seasons = ['Winter', 'Spring', 'Summer', 'Fall'] as const;
export const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
] as const;

export const ChartColors = [
  '#2EACC8',
  '#982DC6',
  '#C05431',
  '#D5C534',
  '#1FBB70',
  '#D235C7',
  '#C33333',
  '#3257DF',
  '#63D43A',
  '#1FBBA4',
  '#CDCDCD'
] as const;

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
      ((date.getMonth() % MONTHS_SHIFT) + 1) / MONTHS_IN_QUARTER
    );
    return `${date.getFullYear()}-${seasonNumber}`;
  },
  month: (date) => `${date.getFullYear()}-${date.getMonth()}`
};

export const mean = (values: number[]) =>
  values.length > 0
    ? values.reduce((prev, curr) => prev + curr, 0) / values.length
    : undefined;

export const ModulesPaths: Record<string, PathInfo> = {
  '/music/genres': {
    name: 'genres',
    label: 'Genres'
  },
  '/music/artists': {
    name: 'artists',
    label: 'Artists'
  },
  '/music/albums': {
    name: 'albums',
    label: 'Albums'
  },
  '/music/tracks': {
    name: 'tracks',
    label: 'Tracks'
  },
  '/music/library': {
    name: 'library',
    label: 'Library'
  },
  '/games/genres': {
    name: 'genres',
    label: 'Genres'
  },
  '/games/studios': {
    name: 'studios',
    label: 'Studios'
  },
  '/games/platforms': {
    name: 'platforms',
    label: 'Platforms'
  },
  '/games/titles': {
    name: 'titles',
    label: 'Video Games'
  },
  '/games/library': {
    name: 'library',
    label: 'Library'
  }
};
