import Game, { GameCore } from '@ts/games/game';
import { RecommendedMetric } from '@ts/games/metric';
import { StudioType } from '@ts/games/studio';

export const RecommendationCategories: Record<keyof RecommendedMetric, string> =
  {
    favorite: 'Games of your favorite genres',
    other: 'Games of genres you might like'
  };

export const RecommendationIds: Record<keyof RecommendedMetric, string> = {
  favorite: 'of-favorite-genres',
  other: 'of-rare-genres'
};

export const isIgdbGenre = (value: unknown): value is Game['genres'][number] =>
  typeof (value as Game['genres'][number])?.name !== 'undefined';

export const isIgdbSeries = (
  value: unknown
): value is NonNullable<Game['series']> =>
  typeof (value as Game['series'])?.games !== 'undefined';

export const StudiosTypeFields: Record<StudioType, keyof GameCore> = {
  developer: 'developersIds',
  publisher: 'publishersIds'
};
