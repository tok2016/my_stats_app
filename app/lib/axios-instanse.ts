import axios, { isAxiosError as originalAxiosError } from 'axios';

const REQUEST_TIMEOUT = 5000;

const AxiosInstanse = axios.create({ timeout: REQUEST_TIMEOUT });
export default AxiosInstanse;

export const AxiosServerInstanse = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: process.env.API
});

export const isAxiosError = originalAxiosError;
