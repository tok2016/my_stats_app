import path from 'path';

import Credentials from '@ts/users/credentials';
import { User } from '@ts/users/user';
import { UserInfo } from '@ts/users/user';
import Dashboard from '@ts/users/dashboard';

export const AVATAR_DIRECTORY = path.join(process.cwd(), 'avatars');

export const MILLISECONDS = 1000;

const SIX_CODE_MULT = 1000000;

export const DashboardTypes = ['metric', 'media', 'text'] as const;

export const ServiceNames = ['spotify', 'steam'] as const;

export const ConfirmationActions = ['password', 'delete'] as const;

export const ServiceStatuses = [
  'authorized',
  'unauthorized',
  'notRequired',
  'error',
  'unknown'
] as const;

export const isExpired = (date: Date | string | number) =>
  new Date(date) < new Date();

export const uniteUserData = (
  credentials: Credentials,
  userInfo: UserInfo,
  dashboards: Dashboard[]
): User => ({
  id: userInfo.id,
  username: credentials.username,
  email: credentials.email,
  createdAt: credentials.createdAt,
  isPublic: userInfo.isPublic,
  dashboards,
  avatarUrl: userInfo.avatarUrl,
  birthdate: userInfo.birthdate,
  country: userInfo.country,
  unblockDate: userInfo.unblockDate
});

export const formatDashboards = (rawDashboards: Dashboard[]): Dashboard[] =>
  rawDashboards.map((dashboard) => ({
    id: dashboard.id,
    object: dashboard.object,
    type: dashboard.type,
    x: dashboard.x,
    y: dashboard.y,
    width: dashboard.width,
    height: dashboard.height,
    service: dashboard.service,
    userId: dashboard.userId
  }));

export const generateCode = () =>
  Math.floor(Math.random() * SIX_CODE_MULT).toString();
