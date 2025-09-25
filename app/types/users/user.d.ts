import Credentials from './credentials';
import UserInfo from './user-info';

export type User = UserInfo & Omit<Credentials, 'password' | 'userId' | 'id'>;
