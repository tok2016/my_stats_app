import { ServiceName } from './service-name';
import { ServiceStatus } from './service-status';

export default interface NewService {
  name: ServiceName;
  login: string;
  status: ServiceStatus;
}
