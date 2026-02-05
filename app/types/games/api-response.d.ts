import { LiteralType } from '@ts/util-types';

import { SortDirection } from './filter';

export interface SteamApiResponse<T> {
  response: T;
}

export interface IgdbAccess {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface ApiToken {
  accessToken: string;
  expiresAt: number;
  tokenType: string;
}

export interface ApiAccess {
  service: 'igdb' | 'steam';
  token: string;
}

export interface IgdbQuery<DataType> {
  fields?: LiteralType<keyof DataType>[];
  exclude?: LiteralType<keyof DataType>[];
  where?: string;
  search?: string;
  sort?: {
    field: LiteralType<keyof DataType>;
    direction: SortDirection;
  };
  limit?: number;
  offset?: number;
}

export interface IgdbBasic {
  id: number;
  name: string;
  slug: string;
}

export interface IgdbItemInfo extends IgdbBasic {
  hours: number;
  games: Game[];
  averageRating?: number;
}
