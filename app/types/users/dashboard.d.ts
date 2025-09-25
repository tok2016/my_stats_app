import z from 'zod';

import { DashboardValidator } from '@lib/validationSchemas';

export type Dashboard = z.infer<typeof DashboardValidator>;
