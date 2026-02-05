import mongoose from 'mongoose';

import {
  ApiSchema,
  ConfirmationsSchema,
  CredentialsSchema,
  DashboardsSchema,
  GamesSchema,
  ServiceCredentialsSchema,
  TracksSchema,
  UsersSchema
} from './schemas';

const mongo = mongoose.createConnection(process.env.DB_URL ?? '', {
  dbName: 'my_stats'
});

export const CredentialsModel = mongo.model('credentials', CredentialsSchema);
export const UsersModel = mongo.model('users', UsersSchema);
export const DashboardsModel = mongo.model('dashboards', DashboardsSchema);
export const ServiceCredentialsModel = mongo.model(
  'service_credentials',
  ServiceCredentialsSchema
);
export const ConfirmationsModel = mongo.model(
  'confirmations',
  ConfirmationsSchema
);
export const TracksModel = mongo.model('tracks', TracksSchema);
export const GamesModel = mongo.model('games', GamesSchema);
export const ApiModel = mongo.model('api', ApiSchema);
