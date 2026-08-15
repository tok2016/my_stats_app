import { GamesFilter } from '@ts/games/filter';

export const NonFormFilterFields: (keyof GamesFilter)[] = [
  'sort',
  'direction',
  'page'
] as const;
