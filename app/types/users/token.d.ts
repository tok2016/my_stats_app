import { NewCredentials } from './new-credentials';

export type Token = Omit<NewCredentials, 'email'> & {
  expiresAt: string;
};
