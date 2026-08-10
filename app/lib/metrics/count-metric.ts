import { GameCore } from '@ts/games/game';
import { CountCompareData, CountData } from '@ts/games/metric';

import { MAX_ENTRIES_IN_CHART, getPercentThreshold } from '@lib/utils';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';

const defaultCompareData: CountCompareData = {
  count: 0,
  minutes: 0
};

const getTopCountData = (
  itemsCount: Map<number | string, CountData>
): CountData[] => {
  let sum = 0;
  let max = 0;

  const values = itemsCount
    .values()
    .toArray()
    .sort((a, b) => b.count - a.count);

  values.forEach((value) => {
    sum += value.count;
    max = value.count > max ? value.count : max;
  });

  const threshold = getPercentThreshold((max / sum) * 100, sum);
  const countData: CountData[] = [];

  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = values[i];
    if (!data) break;

    const percent = (data.count / sum) * 100;

    if (percent < threshold || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      const topSeries = new Map<number, number>();

      values.slice(i).forEach((restData) => {
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
          .reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev))[0]
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

const getSeriesCount = (games: GameCore[]) => {
  const series = new Map<number, CountCompareData>();

  games.forEach((game) => {
    if (!game.seriesId) return;
    const storedSeries = series.get(game.seriesId);
    if (!storedSeries)
      series.set(game.seriesId, {
        count: 1,
        minutes: game.minutes
      });
    else {
      storedSeries.count++;
      storedSeries.minutes += game.minutes;
    }
  });

  return series;
};

const setItemCount = (
  id: number | string,
  game: GameCore,
  itemsCount: Map<number | string, CountData>,
  seriesCount: Map<number | string, CountCompareData>
) => {
  const storedItem = itemsCount.get(id);
  if (!storedItem) {
    itemsCount.set(id, {
      id,
      count: 1,
      percent: 0,
      topSeries: game.seriesId
    });
  } else {
    const storedSeriesCompare =
      seriesCount.get(storedItem.topSeries ?? -1) ?? defaultCompareData;
    const seriesCompare =
      seriesCount.get(game.seriesId ?? -1) ?? defaultCompareData;

    storedItem.count++;
    storedItem.topSeries =
      seriesCompare.count > storedSeriesCompare.count
      || (seriesCompare.count === storedSeriesCompare.count
        && seriesCompare.minutes >= storedSeriesCompare.minutes)
        ? game.seriesId
        : storedItem.topSeries;
  }
};

export const getCountMetric = (
  games: GameCore[],
  itemField: keyof GameCore
): CountData[] => {
  const seriesCount = getSeriesCount(games);
  const itemsCount = new Map<number, CountData>();

  games.forEach((game) => {
    if (isNumberOrStringArray(game[itemField]))
      game[itemField].forEach((item) =>
        setItemCount(item, game, itemsCount, seriesCount)
      );
    else if (isNumberOrString(game[itemField]))
      setItemCount(game[itemField], game, itemsCount, seriesCount);
  });

  return getTopCountData(itemsCount);
};
