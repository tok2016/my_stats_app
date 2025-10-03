import mongoose from 'mongoose';
import {
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
export const DashboarsdModel = mongo.model('dashboards', DashboardsSchema);
export const ServiceCredentialsModel = mongo.model(
  'service_credentials',
  ServiceCredentialsSchema
);
export const TracksModel = mongo.model('tracks', TracksSchema);
export const GamesModel = mongo.model('games', GamesSchema);
