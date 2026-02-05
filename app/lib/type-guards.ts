import { isAxiosError as originalAxiosError } from 'axios';

import { IgdbBasic } from '@ts/games/api-response';
import { SteamGamesList } from '@ts/games/game';
import ErrorResponse from '@ts/requests';

const AcceptableMetricTypes = ['number', 'string'];

export const isNumberOrString = (value: unknown): value is number | string =>
  AcceptableMetricTypes.includes(typeof value);

export const isNumberOrStringArray = (
  value: unknown
): value is Array<number | string> =>
  Array.isArray(value) && value.every((v) => isNumberOrString(v));

export const isErrorResponse = (value: unknown): value is ErrorResponse =>
  (value as ErrorResponse)?.message !== undefined;

export const isSteamGameObject = (value: unknown): value is SteamGamesList =>
  (value as SteamGamesList).games !== undefined;

export const isAxiosError = originalAxiosError;

export const isDateSource = (
  value: unknown
): value is ConstructorParameters<typeof Date>[0] => {
  try {
    new Date(value as ConstructorParameters<typeof Date>[0]);
    return true;
  } catch {
    return false;
  }
};

export const isIgdbItemBasic = (value: unknown): value is IgdbBasic =>
  typeof (value as IgdbBasic)?.id === 'number'
  && typeof (value as IgdbBasic)?.name === 'string';

export const isIgdbItemArray = (value: unknown): value is Array<IgdbBasic> =>
  Array.isArray(value) && value.every((v) => isIgdbItemBasic(v));
