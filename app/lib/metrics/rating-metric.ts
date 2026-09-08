import { GameCore } from '@ts/games/game';
import { RatingData } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import { gameCoreToShort } from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';

import { GAMES_IN_METRIC, generateErrorResponse } from '../utils';

type RatingSumData = Omit<RatingData, 'rating'> & { ratingSum: number };

const aggregateRatingData = (
  game: GameCore,
  item: number | string,
  stored?: RatingSumData
): RatingSumData | undefined => {
  const gameShort = gameCoreToShort(game);
  if (typeof gameShort.rating === 'undefined' || Array.isArray(item))
    return undefined;

  if (stored) stored.topGames.push(gameShort);
  return {
    id: item,
    ratingSum: (stored?.ratingSum ?? 0) + gameShort.rating,
    topGames: stored ? stored.topGames : [gameShort]
  };
};

export const getRatingMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  itemField: ExtractTypeFields<GameCore, number | string | Array<number>>,
  topSize?: number
): RatingData[] => {
  const ratingDataMetric = (
    isKeyOfArrayField(itemField, games.at(0))
      ? games.flatGroupBy(aggregateRatingData, itemField, 'id', undefined)
      : games.groupBy(aggregateRatingData, itemField, 'id', undefined)
  ).filter((ratingData) => !!ratingData.ratingSum);

  if (!ratingDataMetric.count)
    throw generateErrorResponse(404, 'No game was ranked');

  return ratingDataMetric
    .map((ratingData): RatingData => {
      return {
        id: ratingData.id,
        rating: Math.round(ratingData.ratingSum / ratingData.topGames.length),
        topGames: ratingData.topGames
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, GAMES_IN_METRIC)
      };
    })
    .toArray()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, topSize);
};
