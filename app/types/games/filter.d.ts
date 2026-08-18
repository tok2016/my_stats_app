import { GameTableData } from './game';

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
  showRating?: string;
  criticsRatingFrom?: string;
  criticsRatingTo?: string;
  showCriticsRating?: string;
  usersRatingFrom?: string;
  usersRatingTo?: string;
  showUsersRating?: string;
  hoursFrom?: string;
  hoursTo?: string;
  sort?: keyof GameTableData;
  direction?: SortDirection;
  page?: string;
  limit?: string;
}
