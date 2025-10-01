import { DashboardValidator } from '@lib/validationSchemas';
import { DashboardTypes } from '@lib/utils';

export type DashboardType = (typeof DashboardTypes)[number];

export default interface Dashboard {
  object: string;
  type: DashboardType;
  service: ServiceName;
  x: number;
  y: number;
  width: number;
  height: number;
}
