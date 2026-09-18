import { isAxiosError } from 'axios';

import { MetricResponse } from '@ts/requests';
import {
  ConfirmationBaseAction,
  ConfirmationCode,
  ConfirmationInfo
} from '@ts/users/confirmation';

import AxiosInstanse from './axios-instanse';
import { isErrorResponse } from './type-guards';

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

export const deleteConfirmation = async (operationId: string) => {
  if (!operationId) return;

  try {
    await AxiosInstanse.delete(`/api/confirm/${operationId}`);
  } catch {
    return;
  }
};

/**
 * Fetch metric data with request error data.
 * @param url - Endpoint with metric data.
 * @param searchParams - Search params with user id whose metrics are intended to get.
 * @returns Response with metric data if request is successfull. Returns response with error data otherwise.
 */
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
