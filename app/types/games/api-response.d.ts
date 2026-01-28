import { LiteralType } from '@ts/util-types';

export interface SteamApiResponse<T> {
  response: T;
}

export interface RawgApiListResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
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
  service: 'igdb' | 'steam' | 'rawg';
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
