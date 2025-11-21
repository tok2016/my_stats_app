'use server';

import { cookies } from 'next/headers';

import { User } from '@ts/users/user';

import { AxiosServerInstanse } from '@lib/axios-instanse';

const getAccessToken = async () => {
  const cookiesStore = await cookies();
  return cookiesStore.get('accessToken')?.value ?? '';
};

export const getUser = async () => {
  const response = await AxiosServerInstanse.get<User>('/api/user', {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`
    }
  });

  return response.data;
};
