import Credentials from '@ts/users/credentials';
import { Schema, SchemaDefinitionProperty } from 'mongoose';

type CredentialsSchema = Omit<Credentials, 'userId'> & {
  userId: SchemaDefinitionProperty<Schema.Types.ObjectId>;
};

export const CredentialsSchema = new Schema<CredentialsSchema>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
});

export const UsersSchema = new Schema({
  avatarUrl: String,
  birthdate: Date,
  country: String,
  isPublic: Boolean,
  unblockDate: Date,
  dashboards: Schema.Types.Array
});

export const ServiceCredentialsSchema = new Schema({
  userId: Schema.Types.ObjectId,
  status: String,
  login: String,
  service: String
});

export const TracksSchema = new Schema({
  userId: Schema.Types.ObjectId,
  serviceId: String,
  rating: Number,
  rank: Number,
  streams: Number
});

export const GamesSchema = new Schema({
  userId: Schema.Types.ObjectId,
  serviceId: String,
  dataService: String,
  rating: Number,
  rank: Number,
  minutes: Number,
  playDate: Date,
  platform: String
});
