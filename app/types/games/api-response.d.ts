export interface SteamApiResponse<T> {
  response: T;
}

export interface RawgApiListResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
