import Credentials from './credentials';
import UserInfo from './user-info';

export type UserUpdate = Partial<
  Omit<UserInfo, 'id'> & Pick<Credentials, 'email'>
>;
