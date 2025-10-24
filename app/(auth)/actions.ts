import { UserAccess } from '@ts/users/user';
import FormState from '@ts/ui/form-state';

import { getErrorFormState } from '@lib/utils';
import AxiosInstanse from '@lib/axios-instanse';

export const register = async <FormDataType>(
  _state: FormState<FormDataType>,
  formData: FormData
): Promise<FormState<FormDataType>> => {
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
