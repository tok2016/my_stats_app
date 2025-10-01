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
  dashboards: Dashboard[];
}

export interface UserLogin {
  credential: string;
  password: string;
}

export type UserUpdate = Partial<
  Omit<UserInfo, 'id'> & Pick<Credentials, 'email'>
>;

export type User = UserInfo & Omit<Credentials, 'password' | 'userId' | 'id'>;
