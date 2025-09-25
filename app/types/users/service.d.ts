import { ServiceName } from './service-name';
import { ServiceStatus } from './service-status';

export default interface Service {
  id: string;
  userId: string;
  service: ServiceName;
  login: string;
  status: ServiceStatus;
}
