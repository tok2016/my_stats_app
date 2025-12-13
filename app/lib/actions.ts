import {
  ConfirmationBaseAction,
  ConfirmationCode,
  ConfirmationInfo
} from '@ts/users/confirmation';
import FormState from '@ts/ui/form-state';
import { BasicUser } from '@ts/users/user';

import AxiosInstanse from './axios-instanse';
import { defaultConfirmation, getErrorFormState } from './utils';

export const getUsers = async (
  credential?: string,
  limit?: number
): Promise<BasicUser[]> => {
  try {
    const searchParams = new URLSearchParams();

    if (credential) searchParams.append('credential', credential);

    if (limit) searchParams.append('limit', limit.toString());

    const response = await AxiosInstanse.get<BasicUser[]>(
      `/api/users?${searchParams.toString()}`
    );
    return response.data;
  } catch {
    return [];
  }
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

export const getUser = async () => {
  const user = await AxiosInstanse.get('/api/user');
  return user;
};
