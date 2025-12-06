'use server';

import axios, { AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Country, { Countries } from '@ts/users/country';
import { ServicesMap } from '@ts/users/service';
import { User } from '@ts/users/user';

import { defaultCountries, defaultCountry } from './utils';
import { AxiosServerInstanse } from './axios-instanse';

const COUNTRY_REGUEST_TIMEOUT = 10000;

export const logout = async () => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete('accessToken');
  cookiesStorage.delete('refreshToken');

  redirect('/login');
};

const getAuthConfig = async (): Promise<AxiosRequestConfig> => {
  const cookiesStore = await cookies();

  return {
    headers: {
      Authorization: cookiesStore.get('accessToken')?.value ?? ''
    }
  };
};

export const getUser = async (): Promise<User> => {
  const response = await AxiosServerInstanse.get<User>(
    '/api/user',
    await getAuthConfig()
  );

  return response.data;
};

export const getServices = async (userId?: string): Promise<ServicesMap> => {
  if (!userId) {
    return {};
  }

  const response = await AxiosServerInstanse.get<ServicesMap>(
    `/api/user/${userId}/service`,
    await getAuthConfig()
  );

  return response.data;
};

export const getCountyData = async (country?: string): Promise<Country> => {
  try {
    const countryData = await axios.post<Country>(
      `${process.env.COUNTRIES_API}/flag/images`,
      { iso2: country },
      { timeout: COUNTRY_REGUEST_TIMEOUT }
    );

    return countryData.data;
  } catch {
    return { ...defaultCountry, error: true };
  }
};

export const getCountries = async (): Promise<Countries> => {
  if (!process.env.COUNTRIES_API) {
    return { ...defaultCountries, error: true };
  }

  const response = await axios.get<Countries>(
    `${process.env.COUNTRIES_API}/iso`,
    { timeout: COUNTRY_REGUEST_TIMEOUT }
  );

  return response.data;
};
