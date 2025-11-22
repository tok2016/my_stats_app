import FormState from '@ts/ui/form-state';
import { User, UserUpdate } from '@ts/users/user';
import Country, { Countries } from '@ts/users/country';

import AxiosInstanse from '@lib/axios-instanse';
import {
  defaultCountries,
  defaultCountry,
  getErrorFormState
} from '@lib/utils';

const COUNTRY_REGUEST_TIMEOUT = 10000;

export const getCountyData = async (country?: string): Promise<Country> => {
  if (!country || !process.env.COUNTRIES_API) {
    return { ...defaultCountry, error: true };
  }

  const countryData = await AxiosInstanse.post<Country>(
    `${process.env.COUNTRIES_API}/flag/images`,
    { iso2: country },
    { timeout: COUNTRY_REGUEST_TIMEOUT }
  );

  return countryData.data;
};

export const getCountries = async (): Promise<Countries> => {
  if (!process.env.COUNTRIES_API) {
    return { ...defaultCountries, error: true };
  }

  const response = await AxiosInstanse.get<Countries>(
    `${process.env.COUNTRIES_API}/iso`,
    { timeout: COUNTRY_REGUEST_TIMEOUT }
  );

  return response.data;
};

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
