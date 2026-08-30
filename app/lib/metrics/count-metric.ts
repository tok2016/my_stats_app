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

const getTopCountData = (
  itemsCount: ObjectMapArray<CountData, 'id'>
): CountData[] => {
  let sum = 0;
  let max = 0;

  itemsCount
    .sort((a, b) => b.count - a.count)
    .forEach((itemCount) => {
      sum += itemCount.count;
      max = itemCount.count > max ? itemCount.count : max;
    });

  const threshold = getPercentThreshold((max / sum) * 100, sum);
  const countData: CountData[] = [];

  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = itemsCount.at(i);
    if (!data) break;

    const percent = (data.count / sum) * 100;

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

    countData.push({
      id: data.id,
      count: data.count,
      percent: Math.round(percent),
      topSeries: data.topSeries
    });
  }

  return countData;
};

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

const aggregateItemData =
  (seriesCountData: ObjectMapArray<CountCompareData, 'id'>) =>
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

export const getCountMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  itemField: ExtractTypeFields<
    GameCore,
    number | string | Array<number | string>
  >
): CountData[] => {
  const seriesCountData = games.groupBy(
    aggregateSeriesCountData,
    'seriesId',
    'id',
    undefined
  );

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
