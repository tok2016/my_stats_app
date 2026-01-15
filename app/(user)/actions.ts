import FormState, { FormAction } from '@ts/ui/form-state';
import { User, UserClientUpdate, UserUpdate } from '@ts/users/user';
import { ConfirmationBaseAction } from '@ts/users/confirmation';
import { AvatarState } from '@ts/users/avatar';
import { NewService, ServiceName } from '@ts/users/service';

import AxiosInstanse from '@lib/axios-instanse';
import {
  getErrorFormState,
  getFormDataValue,
  parseBooleanString,
  ServiceNames
} from '@lib/utils';
import { confirmByCode } from '@lib/actions';

const STEAM_ID_REGEX = /(?<=\/profiles\/)[a-zA-Z0-9]+/;

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

export const changePassword =
  (signal?: AbortSignal): ConfirmationBaseAction =>
  async (prev, formData) => {
    const passwordUpdate = Object.fromEntries(formData.entries());
    await AxiosInstanse.post('/api/changePassword', passwordUpdate, { signal });
    return prev;
  };

export const deleteAccount =
  (signal?: AbortSignal): ConfirmationBaseAction =>
  async (prev, formData) => {
    const currentOperation = await confirmByCode(prev, formData);

    if (currentOperation.isConfirmed) {
      const searchParams = new URLSearchParams();
      searchParams.append('operationId', currentOperation.id);

      await AxiosInstanse.delete(`/api/user?${searchParams.toString()}`, {
        signal
      });
    }

    return currentOperation;
  };

const updateAvatar = (userId: string, formData: FormData) => {
  const avatar = formData.get('avatar');
  const avatarState = getFormDataValue('avatarState', formData) as AvatarState;

  if (avatar && avatarState === 'update') {
    const avatarData = new FormData();
    avatarData.append('avatar', avatar);
    return AxiosInstanse.post(`/api/user/${userId}/avatar`, avatarData);
  } else if (avatarState === 'delete') {
    return AxiosInstanse.delete(`/api/user/${userId}/avatar`);
  }

  return;
};

const extractCredential: Record<ServiceName, (raw: string) => string> = {
  spotify: (raw) => raw,
  steam: (raw) => {
    try {
      const profileUrl = new URL(raw);
      return profileUrl.pathname.match(STEAM_ID_REGEX)?.[0] ?? raw;
    } catch {
      return raw;
    }
  }
};

const updateService = async (
  userId: string,
  service: ServiceName,
  login: string = ''
) => {
  if (!login) {
    const searchParams = new URLSearchParams();
    searchParams.append('service', service);
    return AxiosInstanse.delete(
      `/api/user/${userId}/service?${searchParams.toString()}`
    );
  }

  const newService: NewService = {
    name: service,
    login: extractCredential[service](login)
  };

  return AxiosInstanse.post(`/api/user/${userId}/service`, newService);
};

export const updateProfile =
  (userId: string): FormAction<UserClientUpdate> =>
  async (prev, formData) => {
    try {
      const servicesRequests = ServiceNames.filter((service) => {
        const prevLogin = getFormDataValue(service, prev.data) ?? '';
        const currentLogin = getFormDataValue(service, formData) ?? '';
        return prevLogin !== currentLogin || !prevLogin;
      }).map((service) =>
        updateService(userId, service, getFormDataValue(service, formData))
      );

      const userJsonUpdate = new FormData();
      formData.forEach((value, key) => {
        if (value instanceof Blob) return;
        userJsonUpdate.append(key, value ?? '');
      });

      const userUpdate = Object.fromEntries(
        userJsonUpdate.entries()
      ) as UserUpdate;

      userUpdate.isPublic = parseBooleanString(
        userJsonUpdate.get('isPublic')?.toString() ?? ''
      );

      await Promise.all([
        updateAvatar(userId, formData),
        [...servicesRequests],
        AxiosInstanse.put('/api/user', userUpdate)
      ]);

      return {
        error: false,
        message: '',
        data: formData
      };
    } catch (err) {
      return getErrorFormState(err, formData);
    }
  };
