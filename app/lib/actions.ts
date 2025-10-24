'use server';

import { cookies } from 'next/headers';

export const setTokenCookies = async (
  accessToken: string,
  refreshToken?: string
) => {
  const cookiesStorage = await cookies();
  cookiesStorage.set('accessToken', accessToken);

  if (refreshToken) {
    cookiesStorage.set('refreshToken', refreshToken);
  }
};

export const setCookie = async (name: string, value: string) => {
  const cookiesStorage = await cookies();
  cookiesStorage.set(name, value);
};

export const getCookies = async (name: string) => {
  const cookiesStorage = await cookies();
  return cookiesStorage.get(name)?.value;
};

export const deleteCookie = async (name: string) => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete(name);
};
