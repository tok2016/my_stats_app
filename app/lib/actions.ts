import { isAxiosError } from 'axios';

import { GamesFilter } from '@ts/games/filter';
import Game from '@ts/games/game';
import { MetricResponse } from '@ts/requests';
import FormState from '@ts/ui/form-state';
import {
  ConfirmationBaseAction,
  ConfirmationCode,
  ConfirmationInfo
} from '@ts/users/confirmation';
import { User } from '@ts/users/user';

import AxiosInstanse from './axios-instanse';
import ObjectMapArray from './object-map-array';
import { isErrorResponse } from './type-guards';
import { defaultConfirmation, getErrorFormState } from './utils';

export const getUsers = async (
  credential?: string,
  limit?: number,
  signal?: AbortSignal
): Promise<User[]> => {
  const searchParams = new URLSearchParams();

  if (credential) searchParams.append('credential', credential);

  if (limit) searchParams.append('limit', limit.toString());

  const response = await AxiosInstanse.get<User[]>(
    `/api/users?${searchParams.toString()}`,
    { signal }
  );

  return response.data;
};

export const getOtherUser = async (userId: string): Promise<User> => {
  const response = await AxiosInstanse.get<User>(`/api/user/${userId}`);
  return response.data;
};

export const getOperation = async (): Promise<ConfirmationInfo> => {
  try {
    const response = await AxiosInstanse.get<ConfirmationInfo>('/api/confirm');
    return response.data;
  } catch {
    return defaultConfirmation;
  }
};

export const requestConfimation =
  (signal?: AbortSignal): ConfirmationBaseAction =>
  async (_prev, formData) => {
    const body = Object.fromEntries(formData.entries());
    const response = await AxiosInstanse.post<ConfirmationInfo>(
      '/api/confirm',
      body,
      { signal }
    );

    return response.data;
  };

export const confirmByCode: ConfirmationBaseAction = async (prev, formData) => {
  const data = Object.fromEntries(
    formData.entries()
  ) as Partial<ConfirmationCode>;

  const body: Partial<ConfirmationCode> = {
    ...prev,
    ...data
  };

  const response = await AxiosInstanse.put<ConfirmationInfo>(
    '/api/confirm',
    body
  );

  return response.data;
};

export const sendCodeAgain = async (
  operationId: string = ''
): Promise<FormState<never>> => {
  try {
    await AxiosInstanse.put(`/api/confirm/${operationId}`);
    return { error: false, message: '' };
  } catch (err) {
    return getErrorFormState(err);
  }
};

export const deleteConfirmation = async (operationId: string) => {
  if (!operationId) return;

  try {
    await AxiosInstanse.delete(`/api/confirm/${operationId}`);
  } catch {
    return;
  }
};

export const getMetricClient = async <MetricType>(
  url: string,
  searchParams: Record<string, string> & { userId: string }
): Promise<MetricResponse<MetricType>> => {
  try {
    const params = new URLSearchParams(searchParams);
    const response = await AxiosInstanse.get<MetricType>(
      `${url}?${params.toString()}`
    );
    return { data: response.data };
  } catch (error) {
    if (isAxiosError(error)) {
      if (isErrorResponse(error.response?.data))
        return { error: error.response.data };

      return {
        error: {
          name: error.name,
          status: error.response?.status ?? 500,
          message: error.response?.statusText ?? error.message,
          issues: []
        }
      };
    }

    return {
      error: {
        name: 'Undefined error',
        status: 500,
        message: 'Something went wrong',
        issues: []
      }
    };
  }
};

export const getGamesClient = async (
  filters: Partial<GamesFilter> & { userId: string }
): Promise<MetricResponse<ObjectMapArray<Game, 'id'>>> => {
  const games = await getMetricClient<Game[]>('/api/games', filters);
  return {
    error: games.error,
    data: !games.data ? undefined : new ObjectMapArray(games.data, 'id')
  };
};
