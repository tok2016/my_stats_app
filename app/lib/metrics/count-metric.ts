import { GameCore } from '@ts/games/game';
import { CountCompareData, CountData } from '@ts/games/metric';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';

const defaultCompareData: CountCompareData = {
  count: 0,
  minutes: 0
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

  return itemsCount
    .values()
    .toArray()
    .sort((a, b) => b.count - a.count);
};
