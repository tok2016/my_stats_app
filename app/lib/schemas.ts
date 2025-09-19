import Dashboard from '@ts/users/dashboard';
import {Schema, Types} from 'mongoose';

export const CredentialsSchema = new Schema({
  userId: Types.ObjectId,
  username: String,
  email: String,
  password: String,
  createdAt: Date
});

export const UsersSchema = new Schema({
  avatarUrl: String,
  birthdate: Date,
  country: String,
  isPublic: Boolean,
  unblockDate: Date,
  dashboards: Types.Array<Dashboard>
});

export const ServiceCredentialsSchema = new Schema({
  userId: Types.ObjectId,
  status: String,
  login: String,
  service: String
});

export const TracksSchema = new Schema({
  userId: Types.ObjectId,
  serviceId: String,
  rating: Number,
  rank: Number,
  streams: Number
});

export const GamesSchema = new Schema({
  userId: Types.ObjectId,
  serviceId: String,
  dataService: String,
  rating: Number,
  rank: Number,
  minutes: Number,
  playDate: Date,
  platform: String
});
