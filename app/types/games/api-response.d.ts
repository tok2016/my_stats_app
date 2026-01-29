import { LiteralType } from '@ts/util-types';

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
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}
