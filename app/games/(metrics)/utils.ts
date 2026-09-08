import Game, { GameCore } from '@ts/games/game';
import { StudioType } from '@ts/games/studio';

export const isIgdbGenre = (value: unknown): value is Game['genres'][number] =>
  typeof (value as Game['genres'][number])?.name !== 'undefined';

export const isIgdbSeries = (
  value: unknown
): value is NonNullable<Game['series']> =>
  typeof (value as Game['series'])?.games !== 'undefined';

export const StudiosGameCoreFields: Record<
  StudioType,
  Extract<keyof GameCore, 'developersIds' | 'publishersIds'>
> = {
  developer: 'developersIds',
  publisher: 'publishersIds'
};

export const StudiosGameFields: Record<
  StudioType,
  Extract<keyof Game, 'developers' | 'publishers'>
> = {
  developer: 'developers',
  publisher: 'publishers'
};
