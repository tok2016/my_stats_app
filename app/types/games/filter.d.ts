import Game from './game';

export type SortDirection = 'desc' | 'asc';

export interface GamesFilter {
  name?: string;
  series?: string;
  developer?: string;
  publisher?: string;
  genre?: string;
  platform?: string;
  releaseFrom?: string;
  releaseTo?: string;
  playDateFrom?: string;
  playDateTo?: string;
  ratingFrom?: string;
  ratingTo?: string;
  metascoreFrom?: string;
  metascoreTo?: string;
  hoursFrom?: string;
  hoursTo?: string;
  sort?: keyof Game;
  direction?: SortDirection;
}
