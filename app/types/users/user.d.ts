import { Types } from 'mongoose';

import Credentials from './credentials';
import Dashboard from './dashboard';

export interface UserAccess {
  access: string;
  refresh: string;
  username: string;
}

export interface UserInfo {
  id: string;
  avatarUrl?: string | null;
  birthdate?: Date | null;
  country?: string | null;
  isPublic: boolean;
  unblockDate?: Date | null;
}

export type UserInfoInSchema = Omit<UserInfo, 'id'> & { _id: Types.ObjectId };

export interface UserLogin {
  credential: string;
  password: string;
}

export type UserUpdate = Partial<
  Omit<UserInfo, 'id' | 'dashboards'> & Pick<Credentials, 'email'>
>;

export type BasicUser = UserInfo
  & Omit<Credentials, 'password' | 'userId' | 'id'>;

export type User = BasicUser & {
  dashboards: Dashboard[];
};
