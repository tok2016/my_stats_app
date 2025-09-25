import { DashboardValidator } from '@lib/validationSchemas';
import { DashboardType } from './dashboard-type';
import { ServiceName } from './service-name';

export default interface Dashboard {
  object: string;
  type: DashboardType;
  service: ServiceName;
  x: number;
  y: number;
  width: number;
  height: number;
}
