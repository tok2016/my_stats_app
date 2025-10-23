import { Types } from 'mongoose';

interface BaseCredentials {
  email: string;
  username: string;
  password: string;
}

export interface NewCredentials extends BaseCredentials {
  repeaetPassword: string;
}

export default interface Credentials extends BaseCredentials {
  id: string;
  userId: string;
  createdAt: Date;
}

export type CredentialsInSchema = Omit<Credentials, 'id'> & {
  _id: Types.ObjectId;
};
