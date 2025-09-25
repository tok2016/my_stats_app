import Credentials from '@ts/users/credentials';
import { User } from '@ts/users/user';
import UserInfo from '@ts/users/user-info';

export const MILLISECONDS = 1000;

export const DashboardTypes = ['metric', 'media', 'text'] as const;

export const ServiceNames = ['spotify', 'steam'] as const;

export const isExpired = (date: Date | string | number) =>
  new Date(date) < new Date();

export const uniteUserData = (
  credentials: Credentials,
  userInfo: UserInfo
): User => ({
  id: userInfo.id,
  username: credentials.username,
  email: credentials.email,
  createdAt: credentials.createdAt,
  isPublic: userInfo.isPublic,
  dashboards: userInfo.dashboards,
  avatarUrl: userInfo.avatarUrl,
  birthdate: userInfo.birthdate,
  country: userInfo.country,
  unblockDate: userInfo.unblockDate
});
