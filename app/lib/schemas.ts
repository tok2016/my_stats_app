import { Schema } from 'mongoose';

import { ApiAccess } from '@ts/games/api-response';
import { GameInSchema } from '@ts/games/game';
import { ConfirmationInSchema } from '@ts/users/confirmation';
import { CredentialsInSchema } from '@ts/users/credentials';
import { ServiceInSchema } from '@ts/users/service';
import { UserInfoInSchema } from '@ts/users/user';

export const CredentialsSchema = new Schema<CredentialsInSchema>({
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
    type: String,
    required: true
  }
});

export const UsersSchema = new Schema<UserInfoInSchema>({
  avatarUrl: String,
  birthdate: String,
  country: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  unblockDate: String,
  metrics: {
    type: [String],
    default: []
  }
});

export const ServiceCredentialsSchema = new Schema<ServiceInSchema>({
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

export const ConfirmationsSchema = new Schema<ConfirmationInSchema>({
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

export const GamesSchema = new Schema<GameInSchema>({
  userId: {
    type: String,
    required: true
  },
  apiId: {
    type: Number,
    required: true
  },
  storeId: Number,
  platformId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  genresIds: Array<number>,
  developersIds: Array<number>,
  publishersIds: Array<number>,
  releasedAt: String,
  coverId: String,
  hours: {
    type: Number,
    default: 0
  },
  seriesId: Number,
  rating: Number,
  playDate: String
});

export const ApiSchema = new Schema<ApiAccess>({
  service: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});
