import { Types } from 'mongoose';

import { ServiceNames, ServiceStatuses } from '@lib/utils';

export type ServiceName = (typeof ServiceNames)[number];

export type ServiceStatus = (typeof ServiceStatuses)[number];

export interface NewService {
  name: ServiceName;
  login: string;
}

export default interface Service extends NewService {
  id: string;
  userId: string;
  status: ServiceStatus;
}

export type ServiceInSchema = Omit<Service, 'id'> & { _id: Types.ObjectId };

export type ServicesMap = Partial<Record<ServiceName, Service>>;

export type ServicesLogins = Partial<Record<ServiceName, string>>;
