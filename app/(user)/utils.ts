import { ServiceName, ServiceStatus } from '@ts/users/service';

export const ServiceNames: Record<ServiceName, string> = {
  spotify: 'Spotify',
  steam: 'Steam'
};

export const ServiceStatusColors: Record<ServiceStatus, string> = {
  authorized: 'success',
  unauthorized: 'warning',
  notRequired: 'success',
  error: 'error',
  unknown: ''
};

export const ServiceStatusNames: Record<ServiceStatus, string> = {
  authorized: 'Authorized',
  unauthorized: 'Unauthorized',
  notRequired: 'Authentication not required',
  error: 'Authentication failed',
  unknown: 'Unknown'
};
