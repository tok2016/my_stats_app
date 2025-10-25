import { UserAccess, UserLogin } from '@ts/users/user';
import FormState from '@ts/ui/form-state';
import { ConfirmationInfo } from '@ts/users/confirmation';
import { NewCredentials } from '@ts/users/credentials';

import { defaultConfirmation, getErrorFormState } from '@lib/utils';
import AxiosInstanse from '@lib/axios-instanse';

export const register = async (
  _state: FormState<NewCredentials>,
  formData: FormData
): Promise<FormState<NewCredentials>> => {
  try {
    const body = Object.fromEntries(formData.entries());
    const response = await AxiosInstanse.post<UserAccess>('/api/user', body);

    return {
      error: false,
      message: response.statusText,
      data: formData
    };
  } catch (err) {
    return getErrorFormState(err, formData);
  }
};

export const login = async (
  _state: FormState<UserLogin>,
  formData: FormData
): Promise<FormState<UserLogin>> => {
  try {
    const body = Object.fromEntries(formData.entries());
    const response = await AxiosInstanse.post<UserAccess>('/api/login', body);

    return {
      error: false,
      message: response.statusText,
      data: formData
    };
  } catch (err) {
    return getErrorFormState(err, formData);
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
