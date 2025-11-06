import axios, { isAxiosError as originalAxiosError } from 'axios';

const AxiosInstanse = axios.create({ timeout: 5000 });
export default AxiosInstanse;

export const isAxiosError = originalAxiosError;
