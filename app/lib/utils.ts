import { PrecisePeriod } from '@ts/games/metric';
import ErrorResponse, { ValidationIssue } from '@ts/requests';
import { Option, PathInfo } from '@ts/ui/components-props';
import FormState from '@ts/ui/form-state';
import { ConfirmationInfo } from '@ts/users/confirmation';
import Country from '@ts/users/country';
import { CredentialsInSchema } from '@ts/users/credentials';
import { User, UserInfoInSchema } from '@ts/users/user';

import { isAxiosError, isErrorResponse } from './type-guards';

export const MILLISECONDS = 1000;
export const MINUTES = 60;
export const MONTHS_IN_YEAR = 12;
export const YEARS_IN_DECADE = 10;

export const CODE_LENGTH = 6;

export const CONFIRMATION_TTL = 30 * 60;

export const TOP_ENTRIES = 3;
export const GAMES_IN_METRIC = 5;
export const ITEMS_IN_RATING = 5;

export const MAX_ENTRIES_IN_CHART = 10;

export const DEFAULT_PERIOD_BLOCK_WIDTH = 11;
export const DEFAULT_PERIOD_BLOCKS_GAP = 1.5;

export const MAX_RATING = 100;

export const ServiceNames = ['spotify', 'steam'] as const;

export const ConfirmationActions = ['password', 'delete'] as const;

export const PrecisePeriods = ['year', 'season', 'month'] as const;

export const GreatPeriods = ['allTime', 'year'] as const;

export const ServiceStatuses = [
  'authorized',
  'unauthorized',
  'notRequired',
  'error',
  'unknown'
] as const;

export const Modules = ['user', 'music', 'games'] as const;

export const Seasons = ['Winter', 'Spring', 'Summer', 'Fall'] as const;

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

export const StudioTypes = ['developer', 'publisher'] as const;

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

export const defaultUser: User = {
  id: '',
  username: '',
  email: '',
  createdAt: new Date().toISOString(),
  metrics: [],
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

/**
 * Unites credentials and user data. Replaces credentials id with user id.
 * @param credentials
 * @param userInfo
 * @returns United user object.
 */
export const uniteUserData = (
  credentials: CredentialsInSchema,
  userInfo: UserInfoInSchema
): User => ({
  id: userInfo._id.toString(),
  username: credentials.username,
  email: credentials.email,
  createdAt: credentials.createdAt,
  ...userInfo
});

/**
 * @returns 6 numbers long code.
 */
export const generateCode = () =>
  Math.floor(Math.random() * Math.pow(10, CODE_LENGTH)).toLocaleString(
    'en-US',
    {
      minimumIntegerDigits: CODE_LENGTH,
      useGrouping: false
    }
  );

/**
 * Forms ErrorResponse object for clearer error info.
 * @param status - HTTP client or server error status.
 * @param message - Reason of error.
 * @param name - Error name. Default name is error's message.
 * @param issues - List of validation issues.
 * @returns ErrorResponse object.
 */
export const generateErrorResponse = (
  status: number,
  message: string,
  name?: string,
  issues: ValidationIssue[] = []
): ErrorResponse => ({
  status,
  message: message,
  issues,
  name: name ?? message
});

/**
 * Decides number form of word depending on given number.
 * @param number - Number.
 * @param singular - Singular form of word.
 * @param plural - Plural form of word.
 * @returns Correct number form of word.
 */
export const getSingularOrPlural = (
  number: number,
  singular: string,
  plural: string
) => (number <= 1 ? singular : plural);

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
};

/**
 * Forms error data for form state.
 * @param err - Error
 * @param data - Form data.
 * @returns Form state with error data.
 */
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
    message: 'Something went wrong',
    data
  };
};

/**
 * Distrubutes validation issues for every object field.
 * @param issues - Validation issues.
 * @returns
 */
const mapIssuesMessages = <T>(
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

/**
 * @param name - Key name to find value by.
 * @param formData
 * @returns String value of form date by given key name or undefined.
 */
export const getFormDataValue = (
  name: string,
  formData?: FormData
): string | undefined => formData?.get(name)?.toString() ?? undefined;

/**
 * @param name - Key name to find value by.
 * @param formData
 * @returns Number value of form date by given key name. Returns undefined if value is not found or NaN.
 */
export const getNumberFormDataValue = (
  name: string,
  formData?: FormData
): number | undefined => {
  const formValue = formData?.get(name)?.toString();
  if (!formValue) return undefined;
  const parsed = parseInt(formValue);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * Parses boolean string from inputs.
 * @param value
 * @returns True if value is not empty, does not equal false or off.
 */
export const parseBooleanString = (value: string) => {
  const lowercase = value.toLowerCase();
  return !!value && lowercase !== 'false' && lowercase !== 'off';
};

export const mean = (values: number[]) =>
  values.length > 0
    ? values.reduce((prev, curr) => prev + curr, 0) / values.length
    : undefined;

export const ModulesPathsAndNames: Record<string, PathInfo> = {
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

/**
 * @param period
 * @param short - If true, return the last 2 digits.
 * @returns Stringified year.
 */
const getYearString = (period: string, short: boolean) => {
  const year = period.split('-')[0] ?? '';
  const startIndex = short && year.length > 2 ? year.length - 2 : 0;
  return year.substring(startIndex, year.length);
};

/**
 * @param period
 * @param short - If true, returns first 3 letters.
 * @returns Name of season.
 */
const getSeasonString = (period: string, short: boolean) => {
  const parts = period.split('-');
  if (!parts[1]) return getYearString(parts[0], short);

  const seasonNumber = (parseInt(parts[1]) - 1) % Seasons.length;
  const endIndex = short ? 3 : Seasons[seasonNumber].length;
  return Seasons[seasonNumber].substring(0, endIndex);
};

/**
 * @param period
 * @param short - If true, returns first 3 letters.
 * @returns Name of month.
 */
const getMonthString = (period: string, short: boolean) => {
  const parts = period.split('-');
  if (!parts[1]) return getYearString(parts[0], short);

  return new Date(period).toLocaleDateString('en-US', {
    month: short ? 'short' : 'long'
  });
};

/**
 * Returns full or short name of period by period type.
 */
export const getPeriodName: Record<
  PrecisePeriod,
  (period: string, short: boolean) => string
> = {
  year: getYearString,
  season: getSeasonString,
  month: getMonthString
};

export const getPercentThreshold = (maxPercentInData: number, sum: number) =>
  (maxPercentInData / (sum * MAX_ENTRIES_IN_CHART)) * 100;
