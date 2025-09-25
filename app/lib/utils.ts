export const MILLISECONDS = 1000;

export const DashboardTypes = ['metric', 'media', 'text'] as const;

export const ServiceNames = ['spotify', 'steam'] as const;

export const isExpired = (date: Date | string | number) =>
  new Date(date) < new Date();
