import { Types } from 'mongoose';

import Password from './password';

interface BaseCredentials {
  email: string;
  username: string;
  password: string;
}

export type NewCredentials = BaseCredentials & Password;

export default interface Credentials extends BaseCredentials {
  id: string;
  userId: string;
  createdAt: string;
}

export type CredentialsInSchema = Omit<Credentials, 'id'> & {
  _id: Types.ObjectId;
};
