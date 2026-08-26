import { GameCore } from '@ts/games/game';
import { CountCompareData, CountData } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { MAX_ENTRIES_IN_CHART, getPercentThreshold } from '@lib/utils';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';

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

const getSeriesCountData = (games: GameCore[]) => {
  const series = new ObjectMapArray<CountCompareData, 'id'>([], 'id');

  games.forEach((game) => {
    if (!game.seriesId) return;

    const storedSeries = series.findByKey(game.seriesId);
    if (!storedSeries)
      series.push({
        id: game.seriesId,
        count: 1,
        hours: game.hours
      });
    else {
      storedSeries.count++;
      storedSeries.hours += game.hours;
    }
  });

  return series;
};

const setItemCount = (
  id: number | string,
  game: GameCore,
  itemsCount: ObjectMapArray<CountData, 'id'>,
  seriesCount: ObjectMapArray<CountCompareData, 'id'>
) => {
  const storedItem = itemsCount.findByKey(id);
  if (!storedItem) {
    itemsCount.push({
      id,
      count: 1,
      percent: 0,
      topSeries: game.seriesId
    });
  } else {
    const storedSeriesCompare =
      seriesCount.findByKey(storedItem.topSeries ?? -1) ?? defaultCompareData;
    const seriesCompare =
      seriesCount.findByKey(game.seriesId ?? -1) ?? defaultCompareData;

    storedItem.count++;
    storedItem.topSeries =
      seriesCompare.count > storedSeriesCompare.count
      || (seriesCompare.count === storedSeriesCompare.count
        && seriesCompare.hours >= storedSeriesCompare.hours)
        ? game.seriesId
        : storedItem.topSeries;
  }
};

export const getCountMetric = (
  games: GameCore[],
  itemField: keyof GameCore
): CountData[] => {
  const seriesCountData = getSeriesCountData(games);
  const itemsCount = new ObjectMapArray<CountData, 'id'>([], 'id');

  games.forEach((game) => {
    if (isNumberOrStringArray(game[itemField]))
      game[itemField].forEach((item) =>
        setItemCount(item, game, itemsCount, seriesCountData)
      );
    else if (isNumberOrString(game[itemField]))
      setItemCount(game[itemField], game, itemsCount, seriesCountData);
  });

  return getTopCountData(itemsCount);
};
