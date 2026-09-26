import { GameCore } from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';

import { MAX_ENTRIES_IN_CHART, getPercentThreshold } from '../utils';

/**
 * Forms top-10 items.
 * Calculates the proportion ot item's playtime among all items.
 * Aggregates items that didn't make into top-10.
 * @param itemsCount - Items compare data.
 * @returns Top-10 items compare data by playtime.
 */
const getTopCountData = (
  itemsCount: ObjectMapArray<PlaytimeData, 'id'>
): PlaytimeData[] => {
  //Calculates sum and max playtime among all items.
  let sum = 0;
  let max = 0;

  itemsCount
    .sort((a, b) => b.hours - a.hours)
    .forEach((value) => {
      sum += value.count;
      max = value.count > max ? value.count : max;
    });

  //Calculates fractions for every item and min fraction threshold.
  const threshold = getPercentThreshold((max / sum) * 100, sum);
  const countData: PlaytimeData[] = [];

  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = itemsCount.at(i);
    if (!data) break;

    const percent = (data.count / sum) * 100;

    //Groups the rest item into one item
    //if playtime percent of current item is less than threshold
    //or the top-10 is already full.
    if (percent < threshold || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      let hours = 0;
      let topGame = data.topGame;

      itemsCount.slice(i).forEach((value) => {
        count += value.count;
        hours += value.hours;
        topGame = value.topGame.hours > topGame.hours ? value.topGame : topGame;
      });

      countData.push({
        id: -1,
        count,
        hours,
        percent: Math.round((count / sum) * 100),
        topGame
      });

      break;
    }

    //Adds compare data with percent to the top.
    countData.push({
      id: data.id,
      count: data.count,
      hours: data.hours,
      percent: Math.round(percent),
      topGame: data.topGame
    });
  }

  return countData;
};

/**
 * Calculates aggregated playtime data for item group.
 * @param game - Game data.
 * @param item - Item value.
 * @param stored - Previously stored item group.
 * @returns Item group with aggregated playtime data.
 */
const aggregatePlaytimeData = (
  game: GameCore,
  item: number | string,
  stored?: PlaytimeData
): PlaytimeData | undefined => ({
  id: item,
  count: (stored?.count ?? 0) + 1,
  hours: (stored?.hours ?? 0) + game.hours,
  percent: 0,
  topGame: !stored || game.hours > stored.topGame.hours ? game : stored.topGame
});

/**
 * Groups games by item field. Calculates top-10 items by playtime and games count.
 * @param games - Games to group.
 * @param itemField - Item field to group by.
 * @returns Top-10 items by playtime.
 */
export const getPlaytimeMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  itemField: ExtractTypeFields<GameCore, number | string | Array<number>>
): PlaytimeData[] => {
  const itemsMap = isKeyOfArrayField(itemField, games.at(0))
    ? games.flatGroupBy(aggregatePlaytimeData, itemField, 'id', undefined)
    : games.groupBy(aggregatePlaytimeData, itemField, 'id', undefined);

  return getTopCountData(itemsMap);
};
