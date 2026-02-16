import axios from 'axios';
import Bottleneck from 'bottleneck';

import {
  ApiAccess,
  ApiToken,
  IgdbAccess,
  IgdbQuery
} from '@ts/games/api-response';

import { AxiosIgdbInstance } from '../axios-instanse';
import { ApiModel } from '../models';
import { decodeJwt, encodeJwt } from '../token';
import { isExpired } from '../utils';

const IGDB_REQUEST_FREQUENCY = 250;
const EXECUTABLE_PER_TIME = 2;

const igdbRateLimiter = new Bottleneck({
  minTime: IGDB_REQUEST_FREQUENCY,
  maxConcurrent: EXECUTABLE_PER_TIME
});

igdbRateLimiter.on('scheduled', (info) => {
  console.log('Scheduled');
  console.log(info.options);
});

igdbRateLimiter.on('executing', (info) => {
  console.log('Executing');
  console.log(info.options);
  console.log(info.retryCount);
});

igdbRateLimiter.on('received', (info) => {
  console.log('Received');
  console.log(info.options);
});

const getIgdbAccess = async (
  searchParams: URLSearchParams
): Promise<IgdbAccess> => {
  const response = await axios.post<IgdbAccess>(
    `${process.env.TWITCH_ACCESS_API}?${searchParams.toString()}`
  );

  return response.data;
};

const updateIgdbAccess = async (): Promise<ApiToken> => {
  const searchParams = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID ?? '',
    client_secret: process.env.TWITCH_SECRET ?? '',
    grant_type: 'client_credentials'
  });

  const igdbAccess = await igdbRateLimiter.schedule({ priority: 0 }, () =>
    getIgdbAccess(searchParams)
  );

  const apiToken: ApiToken = {
    accessToken: igdbAccess.access_token,
    expiresAt: Date.now() + igdbAccess.expires_in,
    tokenType: igdbAccess.token_type
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

const getIgdbData = async <DataType>(
  url: string,
  queryString: string,
  apiToken: ApiToken
): Promise<DataType[]> => {
  const response = await AxiosIgdbInstance.post<DataType[]>(url, queryString, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `${apiToken.tokenType} ${apiToken.accessToken}`
    }
  });

  return response.data;
};

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
  const igdbData = await igdbRateLimiter.schedule<DataType[]>(
    { priority: 1 },
    () => getIgdbData(url, queryString, apiToken)
  );

  return igdbData;
};
