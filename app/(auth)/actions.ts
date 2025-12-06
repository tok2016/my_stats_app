import { UserAccess, UserLogin } from '@ts/users/user';
import { FormAction } from '@ts/ui/form-state';
import { ConfirmationBaseAction } from '@ts/users/confirmation';
import { NewCredentials } from '@ts/users/credentials';
import { NewPassword } from '@ts/users/password';

import { getErrorFormState } from '@lib/utils';
import AxiosInstanse from '@lib/axios-instanse';

export const register: FormAction<NewCredentials> = async (
  _state,
  formData
) => {
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

export const login: FormAction<UserLogin> = async (_state, formData) => {
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

export const resetPassword: ConfirmationBaseAction = async (prev, formData) => {
  const passwordData = Object.fromEntries(
    formData.entries()
  ) as Partial<NewPassword>;
  const body: Partial<NewPassword> = {
    ...passwordData,
    credential: prev.credential,
    operationId: prev.id
  };

  await AxiosInstanse.post('/api/resetPassword', body);
  return prev;
};
