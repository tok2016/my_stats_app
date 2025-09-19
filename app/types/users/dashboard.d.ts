import { DashboardType } from './dashboard-type';
import { ServiceName } from './service-name';

export default interface Dashboard {
  object: string;
  service: ServiceName;
  x: number;
  y: number;
  width: number;
  height: number;
  type: DashboardType
};
