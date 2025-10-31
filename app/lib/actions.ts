import {
  ConfirmationBaseAction,
  ConfirmationCode,
  ConfirmationInfo
} from '@ts/users/confirmation';

import AxiosInstanse from './axios-instanse';
import { defaultConfirmation, getErrorFormState } from './utils';
import FormState from '@ts/ui/form-state';

export const getOperation = async (): Promise<ConfirmationInfo> => {
  try {
    const response = await AxiosInstanse.get<ConfirmationInfo>('/api/confirm');
    return response.data;
  } catch {
    return defaultConfirmation;
  }
};

export const requestConfimation: ConfirmationBaseAction = async (
  _prev,
  formData
) => {
  const body = Object.fromEntries(formData.entries());
  const response = await AxiosInstanse.post<ConfirmationInfo>(
    '/api/confirm',
    body
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
  operationId: string
): Promise<FormState<never>> => {
  try {
    await AxiosInstanse.put(`/api/confirm/${operationId}`);
    return { error: false, message: '' };
  } catch (err) {
    return getErrorFormState(err);
  }
};
