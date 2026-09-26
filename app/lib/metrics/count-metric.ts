import { GameCore } from '@ts/games/game';
import { CountCompareData, CountData } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';
import { MAX_ENTRIES_IN_CHART, getPercentThreshold } from '@lib/utils';

const defaultCompareData: CountCompareData = {
  id: -1,
  count: 0,
  hours: 0
};

/**
 * Forms top-10 items.
 * Calculates the proportion ot item's games count among all items.
 * Aggregates items that didn't make into top-10.
 * @param itemsCount - Items compare data.
 * @returns Top-10 items compare data by games count.
 */
const getTopCountData = (
  itemsCount: ObjectMapArray<CountData, 'id'>
): CountData[] => {
  //Calculates sum and max games count among all items.
  let sum = 0;
  let max = 0;

  itemsCount
    .sort((a, b) => b.count - a.count)
    .forEach((itemCount) => {
      sum += itemCount.count;
      max = itemCount.count > max ? itemCount.count : max;
    });

  //Calculates fractions for every item and min fraction threshold.
  const threshold = getPercentThreshold((max / sum) * 100, sum);
  const countData: CountData[] = [];

  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = itemsCount.at(i);
    if (!data) break;

    const percent = (data.count / sum) * 100;

    //Groups the rest item into one item
    //if games count percent of current item is less than threshold
    //or the top-10 is already full.
    if (percent < threshold || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      const topSeries = new Map<number, number>();

      itemsCount.slice(i).forEach((restData) => {
        count += restData.count;
        if (restData.topSeries)
          topSeries.set(
            restData.topSeries,
            (topSeries.get(restData.topSeries) ?? 0) + 1
          );
      });

      countData.push({
        id: -1,
        count,
        percent: Math.round((count / sum) * 100),
        topSeries: topSeries
          .entries()
          .reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev), [0, 0])[0]
      });

      break;
    }

    //Adds compare data with percent to the top.
    countData.push({
      id: data.id,
      count: data.count,
      percent: Math.round(percent),
      topSeries: data.topSeries
    });
  }

  return countData;
};

/**
 * Calculates compate data for series groups.
 * @param game - Game data.
 * @param seriesId - Series id of game.
 * @param stored - Previously stored series group.
 * @returns Series group with aggregated data.
 */
const aggregateSeriesCountData = (
  game: GameCore,
  seriesId: number | undefined,
  stored?: CountCompareData
) => {
  if (typeof seriesId === 'undefined') return undefined;
  return {
    id: seriesId,
    count: (stored?.count ?? 0) + 1,
    hours: (stored?.hours ?? 0) + game.hours
  };
};

/**
 * Calculates compare data for item group.
 * @param seriesCountData - Series data to compare by.
 * @returns Aggregate callback.
 */
const aggregateItemData =
  (seriesCountData: ObjectMapArray<CountCompareData, 'id'>) =>
  /**
   * Calculates compare data for item group.
   * @param game - Game data.
   * @param item - Item value.
   * @param stored - Previously stored item group.
   * @returns Item group with aggregated data.
   */
  (
    game: GameCore,
    item: number | string,
    stored?: CountData
  ): CountData | undefined => {
    const storedSeriesCompare =
      seriesCountData.findByKey(stored?.topSeries ?? -1) ?? defaultCompareData;
    const seriesCompare =
      seriesCountData.findByKey(game.seriesId ?? -1) ?? defaultCompareData;

    return {
      id: item,
      count: (stored?.count ?? 0) + 1,
      percent: 0,
      topSeries:
        seriesCompare.count > storedSeriesCompare.count
        || (seriesCompare.count === storedSeriesCompare.count
          && seriesCompare.hours >= storedSeriesCompare.hours)
          ? game.seriesId
          : stored?.topSeries
    };
  };

/**
 * Groups games by item field and makes top of these item groups by games count as an aggregated value.
 * @param games - Games to group.
 * @param itemField - Field to group by.
 * @returns Top grouped items by games count.
 */
export const getCountMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  itemField: ExtractTypeFields<
    GameCore,
    number | string | Array<number | string>
  >
): CountData[] => {
  //Groups games by series, calculating aggregated games count and playtime.
  const seriesCountData = games.groupBy(
    aggregateSeriesCountData,
    'seriesId',
    'id',
    undefined
  );

  //Groups games by given item, calculating aggregated games count and top series.
  const itemsCount = isKeyOfArrayField(itemField, games.at(0))
    ? games.flatGroupBy(
        aggregateItemData(seriesCountData),
        itemField,
        'id',
        undefined
      )
    : games.groupBy(
        aggregateItemData(seriesCountData),
        itemField,
        'id',
        undefined
      );

  return getTopCountData(itemsCount);
};
