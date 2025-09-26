import NewService from './new-service';
import { ServiceName } from './service-name';
import { ServiceStatus } from './service-status';

export default interface Service extends NewService {
  id: string;
  userId: string;
}
