import z from 'zod';

import { CredentialsValidator } from '@lib/validationSchemas';

export default interface NewCredentials {
  email: string;
  username: string;
  password: string;
}
