import FormState from '@ts/ui/form-state';
import { User, UserUpdate } from '@ts/users/user';

import AxiosInstanse from '@lib/axios-instanse';
import { getErrorFormState } from '@lib/utils';

export const changeProfilePrivacy =
  (closePopup: () => void) =>
  async (isPublic?: boolean): Promise<FormState<undefined>> => {
    try {
      const update: Partial<UserUpdate> = {
        isPublic: typeof isPublic === 'undefined' ? undefined : !isPublic
      };
      const response = await AxiosInstanse.put<User>('/api/user', update);

      closePopup();

      return {
        error: false,
        message: response.statusText
      };
    } catch (err) {
      return getErrorFormState(err);
    }
  };
