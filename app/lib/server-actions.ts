'use server';

import { AxiosRequestConfig } from 'axios';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GamesFilter } from '@ts/games/filter';
import { GamesTablePageResponse } from '@ts/games/game';
import { CountData, MetricId } from '@ts/games/metric';
import Country, { CountryIso, CountryResponse } from '@ts/users/country';
import { ServicesMap } from '@ts/users/service';
import { User } from '@ts/users/user';

import AxiosInstanse, { AxiosCountriesInstanse } from './axios-instanse';
import { defaultCountry, getErrorFormState } from './utils';

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

export const getCurrentUser = async (): Promise<User> => {
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
  users: User[]
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

export const getUserDashboard = async (
  userId?: string
): Promise<MetricId[]> => {
  const url = userId ? `/api/user/${userId}/dashboard` : '/api/dashboard';

  try {
    const response = await AxiosInstanse.get<MetricId[]>(
      url,
      await getAuthConfig()
    );

    return response.data;
  } catch {
    return [];
  }
};

export const getData = async <DataType>(url: string): Promise<DataType> => {
  const response = await AxiosInstanse.get<DataType>(
    url,
    await getAuthConfig()
  );

  return response.data;
};

export const getMetricData = async <MetricType>(
  url: string,
  userId: string,
  searchParams?: Record<string, string>
): Promise<MetricType> => {
  const params = new URLSearchParams({ user: userId, ...searchParams });
  const response = await AxiosInstanse.get<MetricType>(
    `${url}?${params.toString()}`,
    await getAuthConfig()
  );
  return response.data;
};

export const getGames = async (
  params: Partial<GamesFilter> & { userId: string }
): Promise<GamesTablePageResponse> => {
  const searchParams = new URLSearchParams(params);
  const response = await AxiosInstanse.get<GamesTablePageResponse>(
    `/api/games?${searchParams.toString()}`,
    await getAuthConfig()
  );

  return response.data;
};

export const refreshSteamData = async () => {
  try {
    const response = await AxiosInstanse.post(
      '/api/games/steam',
      '',
      await getAuthConfig()
    );
    return response.statusText;
  } catch (err) {
    return getErrorFormState(err).message;
  }
};
