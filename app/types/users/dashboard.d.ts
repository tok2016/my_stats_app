import { Types } from 'mongoose';

import { ServiceName } from './service';

import { DashboardValidator } from '@lib/validationSchemas';
import { DashboardTypes } from '@lib/utils';

export type DashboardType = (typeof DashboardTypes)[number];

export interface NewDashboard {
  object: string;
  type: DashboardType;
  service: ServiceName;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DashboardUpdate = Partial<NewDashboard>;

export default interface Dashboard extends NewDashboard {
  id: string;
  userId: string;
}

export type DashboardInSchema = Omit<Dashboard, 'id'> & { _id: Types.ObjectId };
