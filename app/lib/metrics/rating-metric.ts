import { GameCore } from '@ts/games/game';
import { RatingData } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import { gameCoreToShort } from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';

import { GAMES_IN_METRIC, generateErrorResponse } from '../utils';

type RatingSumData = Omit<RatingData, 'rating'> & { ratingSum: number };

/**
 * Calculates aggregated ratings sum and rated games for item group.
 * @param game - Game data.
 * @param item - Item value.
 * @param stored - Previously stored item group.
 * @returns Item group with aggregated data.
 */
const aggregateRatingData = (
  game: GameCore,
  item: number | string,
  stored?: RatingSumData
): RatingSumData | undefined => {
  //Skips not-rated game.
  const gameShort = gameCoreToShort(game);
  if (typeof gameShort.rating === 'undefined') return undefined;

  if (stored) stored.topGames.push(gameShort);
  return {
    id: item,
    ratingSum: (stored?.ratingSum ?? 0) + gameShort.rating,
    topGames: stored ? stored.topGames : [gameShort]
  };
};

/**
 * Groups games by item field and calculates top items by aggregated rating.
 * @param games - Games to group.
 * @param itemField - Item field to group by.
 * @param topSize - Max entries in top.
 * @returns Top items by aggregated rating.
 */
export const getRatingMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  itemField: ExtractTypeFields<GameCore, number | string | Array<number>>,
  topSize?: number
): RatingData[] => {
  //Groups games by given item field, calculating ratings sum and games with ratings.
  const ratingDataMetric = (
    isKeyOfArrayField(itemField, games.at(0))
      ? games.flatGroupBy(aggregateRatingData, itemField, 'id', undefined)
      : games.groupBy(aggregateRatingData, itemField, 'id', undefined)
  ).filter((ratingData) => !!ratingData.ratingSum);

  if (!ratingDataMetric.count)
    throw generateErrorResponse(404, 'No game was ranked');

  //Calculates mean rating, sorts games by rating and picks top-5.
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
