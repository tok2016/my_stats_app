import axios from 'axios';

import {
  ApiAccess,
  ApiToken,
  IgdbAccess,
  IgdbQuery
} from '@ts/games/api-response';

import { AxiosIgdbInstance } from './axios-instanse';
import { ApiModel } from './models';
import { decodeJwt, encodeJwt } from './token';
import { isExpired } from './utils';

const updateIgdbAccess = async (): Promise<ApiToken> => {
  const searchParams = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID ?? '',
    client_secret: process.env.TWITCH_SECRET ?? '',
    grant_type: 'client_credentials'
  });

  const response = await axios.post<IgdbAccess>(
    `${process.env.TWITCH_ACCESS_API}?${searchParams.toString()}`
  );

  const apiToken: ApiToken = {
    accessToken: response.data.access_token,
    expiresAt: Date.now() + response.data.expires_in,
    tokenType: response.data.token_type
  };

  const apiAccess: ApiAccess = {
    service: 'igdb',
    token: await encodeJwt(apiToken)
  };

  await ApiModel.updateOne({ service: 'igdb' }, apiAccess);
  return apiToken;
};

const decodeApiToken = async (apiAccess: string): Promise<ApiToken> => {
  const decoded = await decodeJwt<ApiToken>(apiAccess);

  return {
    accessToken: decoded.payload.accessToken,
    expiresAt: decoded.payload.expiresAt,
    tokenType: decoded.payload.tokenType
  };
};

const getQueryString = <DataType>(query: IgdbQuery<DataType>): string =>
  Object.entries(query)
    .map(([key, value]) => {
      let valueString = '';

      if (value instanceof Array) valueString = value.join(',');
      else if (typeof value === 'object')
        valueString = Object.values(value).join(' ');
      else valueString = value;

      return `${key} ${valueString}`;
    })
    .join('; ') + ';';

export const igdbRequest = async <DataType>(
  url: string,
  query: IgdbQuery<DataType>
): Promise<DataType[]> => {
  const apiAccess = (await ApiModel.findOne({ service: 'igdb' }).lean())?.token;
  let apiToken = apiAccess ? await decodeApiToken(apiAccess) : undefined;

  if (!apiToken || isExpired(apiToken.expiresAt)) {
    const newAccess = await updateIgdbAccess();
    apiToken = newAccess;
  }

  const queryString = getQueryString(query);
  console.log(queryString);
  const response = await AxiosIgdbInstance.post<DataType[]>(url, queryString, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `${apiToken.tokenType} ${apiToken.accessToken}`
    }
  });

  return response.data;
};
