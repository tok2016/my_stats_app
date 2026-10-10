'use server';

import { AxiosRequestConfig } from 'axios';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GamesFilter } from '@ts/games/filter';
import { GamesTablePageResponse } from '@ts/games/game';
import { GameItemsData } from '@ts/games/metric';
import Country, { CountryIso, CountryResponse } from '@ts/users/country';
import { ServicesMap } from '@ts/users/service';
import { User } from '@ts/users/user';

import AxiosInstanse, { AxiosCountriesInstanse } from './axios-instanse';
import { defaultCountry, getErrorFormState } from './utils';

/**
 * Logs user out by deleting tokens. Redirects to login page.
 */
export const logout = async () => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete('accessToken');
  cookiesStorage.delete('refreshToken');

  redirect('/login');
};

/**
 * Forms authorization headers with tokens.
 * @returns Authorization and refresh headers with tokens.
 */
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

export const tryGetCurrentUser = async (): Promise<User> => {
  const response = await AxiosInstanse.get<User>(
    '/api/user',
    await getAuthConfig()
  );

  return response.data;
};

export const getServicesByUserId = async (
  userId?: string
): Promise<ServicesMap> => {
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

export const getCountryData = async (country?: string): Promise<Country> => {
  try {
    const countryData = await AxiosCountriesInstanse.post<
      CountryResponse<Country>
    >('/flag/images', { iso2: country });

    return countryData.data.data;
  } catch {
    return defaultCountry;
  }
};

export const getCountriesList = async (): Promise<CountryIso[]> => {
  try {
    const response =
      await AxiosCountriesInstanse.get<CountryResponse<CountryIso[]>>('/iso');
    return response.data.data;
  } catch {
    return [];
  }
};

/**
 * Fetches data of countries of given users.
 * @param users
 * @returns Map of users ids and their countries data.
 */
export const getUsersCountriesData = async (
  users: User[]
): Promise<Record<string, Country | undefined>> => {
  try {
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
  } catch {
    return {};
  }
};

/**
 * Fetches data by API type that needs authorization.
 * @param url
 * @throws AxiosError.
 * @returns Data of given type.
 */
export const tryGetDataAuthorized = async <DataType>(
  url: string
): Promise<DataType> => {
  const response = await AxiosInstanse.get<DataType>(
    url,
    await getAuthConfig()
  );

  return response.data;
};

/**
 * Fetches games by given user id and filter params.
 * @param params - Filter params with user id.
 * @returns Filtered games. If no filter param is given, return all user's games.
 */
export const tryGetGames = async (
  params: Partial<GamesFilter> & { userId: string }
): Promise<GamesTablePageResponse> => {
  const searchParams = new URLSearchParams(params);
  const response = await AxiosInstanse.get<GamesTablePageResponse>(
    `/api/games?${searchParams.toString()}`,
    await getAuthConfig()
  );

  return response.data;
};

/**
 * Sends request to refresh data from steam.
 * @returns Response status text or error message.
 */
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

/**
 * @param userId - User whose data will be fetched.
 * @returns Data of games metadata items: genres, platforms, etc.
 */
export const tryGetGameItemsData = async (userId: string) => {
  const searchParams = new URLSearchParams({ userId });
  const response = await AxiosInstanse.get<GameItemsData>(
    `/api/games/items?${searchParams.toString()}`
  );

  return response.data;
};
