'use server';

import { AxiosRequestConfig } from 'axios';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CountData } from '@ts/games/metric';
import Country, { CountryIso, CountryResponse } from '@ts/users/country';
import { ServicesMap } from '@ts/users/service';
import { BasicUser, User } from '@ts/users/user';

import AxiosInstanse, { AxiosCountriesInstanse } from './axios-instanse';
import { defaultCountry } from './utils';

export const logout = async () => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete('accessToken');
  cookiesStorage.delete('refreshToken');

  redirect('/login');
};

const getAuthConfig = async (): Promise<AxiosRequestConfig | undefined> => {
  const cookiesStore = await cookies();

  const access = cookiesStore.get('accessToken')?.value;
  const refresh = cookiesStore.get('refreshToken')?.value ?? '';

  return {
    headers: {
      Authorization: access ? `Bearer ${access}` : '',
      'MyS-Refresh': refresh
    }
  };
};

export const getUser = async (): Promise<User> => {
  const response = await AxiosInstanse.get<User>(
    '/api/user',
    await getAuthConfig()
  );

  return response.data;
};

export const getServices = async (userId?: string): Promise<ServicesMap> => {
  if (!userId) {
    return {};
  }

  try {
    const response = await AxiosInstanse.get<ServicesMap>(
      `/api/user/${userId}/service`,
      await getAuthConfig()
    );

    return response.data;
  } catch {
    return {};
  }
};

export const getCountyData = async (country?: string): Promise<Country> => {
  try {
    const countryData = await AxiosCountriesInstanse.post<
      CountryResponse<Country>
    >('/flag/images', { iso2: country });

    return countryData.data.data;
  } catch {
    return defaultCountry;
  }
};

export const getCountries = async (): Promise<CountryIso[]> => {
  if (!process.env.COUNTRIES_API) {
    return [];
  }

  const response =
    await AxiosCountriesInstanse.get<CountryResponse<CountryIso[]>>('/iso');

  return response.data.data;
};

export const getUserCountries = async (
  users: BasicUser[]
): Promise<Record<string, Country | undefined>> => {
  if (!process.env.COUNTRIES_API) {
    return {};
  }

  const response =
    await AxiosCountriesInstanse.get<CountryResponse<Country[]>>(
      '/flag/images'
    );

  const countriesMap: Record<string, Country> = Object.fromEntries(
    response.data.data.map((country) => [country.iso2, country])
  );

  return Object.fromEntries(
    users.map((user) => [
      user.id,
      user.country ? countriesMap[user.country] : undefined
    ])
  );
};

export const getGenresCount = async (): Promise<CountData[]> => {
  try {
    const response = await AxiosInstanse.get<CountData[]>(
      `/api/games/genres/count`,
      await getAuthConfig()
    );

    return response.data;
  } catch {
    return [];
  }
};
