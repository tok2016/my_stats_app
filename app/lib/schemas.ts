import { Schema } from 'mongoose';

import Credentials from '@ts/users/credentials';
import Dashboard from '@ts/users/dashboard';
import Service from '@ts/users/service';
import { UserInfo } from '@ts/users/user';
import Confirmation from '@ts/users/confirmation';

export const CredentialsSchema = new Schema<Credentials>({
  userId: {
    type: String,
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

export const UsersSchema = new Schema<UserInfo>({
  avatarUrl: String,
  birthdate: Date,
  country: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  unblockDate: Date
});

export const DashboardsSchema = new Schema<Dashboard>({
  object: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  service: {
    type: String,
    default: 'spotify'
  },
  userId: {
    type: String,
    required: true
  }
});

export const ServiceCredentialsSchema = new Schema<Service>({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unknown'
  },
  login: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'spotify'
  }
});

export const ConfirmationsSchema = new Schema<Confirmation>({
  credential: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    default: 'password'
  }
});

export const TracksSchema = new Schema({
  userId: String,
  serviceId: String,
  rating: Number,
  rank: Number,
  streams: Number
});

export const GamesSchema = new Schema({
  userId: String,
  serviceId: String,
  dataService: String,
  rating: Number,
  rank: Number,
  minutes: Number,
  playDate: Date,
  platform: String
});
