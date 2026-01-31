import axios from 'axios';

const REQUEST_TIMEOUT = 10000;
const COUNTRIES_API_TIMEOUT = 10000;
const IGDB_REQUEST_TIMEOUT = 100000;

const AxiosInstanse = axios.create({
  baseURL: process.env.API,
  timeout: REQUEST_TIMEOUT
});
export default AxiosInstanse;

export const AxiosCountriesInstanse = axios.create({
  timeout: COUNTRIES_API_TIMEOUT,
  baseURL: process.env.COUNTRIES_API
});

export const AxiosSteamInstanse = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: process.env.STEAM_API
});

export const AxiosIgdbInstance = axios.create({
  timeout: IGDB_REQUEST_TIMEOUT,
  baseURL: process.env.IGDB_API
});
