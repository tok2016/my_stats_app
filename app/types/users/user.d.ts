import { Types } from 'mongoose';

import { MetricId } from '@ts/games/metric';

import { AvatarState } from './avatar';
import Credentials from './credentials';
import { ServicesLogins } from './service';

export interface UserAccess {
  access: string;
  refresh: string;
  username: string;
}

export interface UserInfo {
  id: string;
  avatarUrl?: string | null;
  birthdate?: string | null;
  country?: string | null;
  isPublic: boolean;
  unblockDate?: string | null;
  metrics: MetricId[];
}

export type UserInfoInSchema = Omit<UserInfo, 'id'> & {
  _id: Types.ObjectId;
};

export interface UserLogin {
  credential: string;
  password: string;
}

export type UserUpdate = Partial<
  Omit<UserInfo, 'id' | 'metrics' | 'avatarUrl'> & Pick<Credentials, 'email'>
>;

export type UserClientUpdate = UserUpdate
  & ServicesLogins & {
    avatar?: File;
    avatarState?: AvatarState;
  };

export type User = UserInfo & Omit<Credentials, 'password' | 'userId' | 'id'>;
export type UserSet = Omit<User, 'metrics'> & { metrics: Set<MetricId> };

export type UserRouteParams = Pick<Credentials, 'userId'>;
