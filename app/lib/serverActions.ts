'use server';

import { cookies } from 'next/headers';
import { AxiosRequestConfig } from 'axios';

import { User } from '@ts/users/user';
import { ServicesMap } from '@ts/users/service';

import { AxiosServerInstanse } from '@lib/axios-instanse';

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
