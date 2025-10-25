import {
  ConfirmationBaseAction,
  ConfirmationInfo
} from '@ts/users/confirmation';

import AxiosInstanse from './axios-instanse';
import { defaultConfirmation } from './utils';

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
