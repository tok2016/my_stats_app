import { GamesFilter } from '@ts/games/filter';

export type GamesFilterFormData = Omit<
  GamesFilter,
  'sort' | 'direction' | 'page' | 'limit'
>;
