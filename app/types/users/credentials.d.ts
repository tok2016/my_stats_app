import { Types } from 'mongoose';

export interface NewCredentials {
  email: string;
  username: string;
  password: string;
}

export default interface Credentials extends NewCredentials {
  id: string;
  userId: string;
  createdAt: Date;
}

export type CredentialsInSchema = Omit<Credentials, 'id'> & {
  _id: Types.ObjectId;
};
