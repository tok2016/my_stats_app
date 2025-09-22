import z from 'zod';

import { CredentialsValidator } from '@lib/validationSchemas';

export type NewCredentials = z.infer<typeof CredentialsValidator>;
