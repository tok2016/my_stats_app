import { GameCore } from '@ts/games/game';
import { CountCompareData, CountData } from '@ts/games/metric';
import { IgdbSeries, ItemSeries } from '@ts/games/series';

import { igdbRequest } from '../games/igdb';
import { isNumberOrString, isNumberOrStringArray } from '../type-guards';

const setSeriesItemCount = async (
  item: number | string,
  game: GameCore,
  map: Map<number | string, CountCompareData>
) => {
  const currentItem = map.get(item);

  map.set(item, {
    count: (currentItem?.count ?? 0) + 1,
    minutes: (currentItem?.minutes ?? 0) + game.minutes
  });
};

const getCompareDataEntry = (
  item: unknown,
  game: GameCore
): [number, CountCompareData][] => {
  if (Array.isArray(item))
    return item.map((i) => [i, { count: 1, minutes: game.minutes }]);
  else if (typeof item === 'number')
    return [[item, { count: 1, minutes: game.minutes }]];
  return [];
};

const getSeries = async (
  games: GameCore[],
  dataField: keyof GameCore
): Promise<ItemSeries[]> => {
  const seriesIds: number[] = [];
  const gamesMap = new Map<number, GameCore>();

  games.forEach((game) => {
    if (game.seriesId) seriesIds.push(game.seriesId);
    gamesMap.set(game.apiId, game);
  });

  const allIgdbSeries = await igdbRequest<IgdbSeries>('/collections', {
    fields: ['games', 'name'],
    where: `id = (${seriesIds.join(',')})`,
    limit: seriesIds.length
  });

  const series: ItemSeries[] = allIgdbSeries.map((igdbSeries) => {
    const itemsCountMap = new Map<number, CountCompareData>();

    igdbSeries.games.forEach((gameApiId) => {
      const game = gamesMap.get(gameApiId);
      if (isNumberOrStringArray(game?.[dataField]))
        game[dataField].forEach((item) =>
          setSeriesItemCount(item, game, itemsCountMap)
        );
      else if (isNumberOrString(game?.[dataField]))
        setSeriesItemCount(game[dataField], game, itemsCountMap);

      gamesMap.delete(gameApiId);
    });

    return {
      id: igdbSeries.id,
      name: igdbSeries.name,
      itemsMap: itemsCountMap
    };
  });

  gamesMap.forEach((game) => {
    const itemsMap = new Map<number, CountCompareData>(
      getCompareDataEntry(game[dataField], game)
    );
    series.push({ id: 0, name: game.name, itemsMap });
  });

  return series;
};

export const getCountMetric = async (
  games: GameCore[],
  dataField: keyof GameCore
): Promise<CountData[]> => {
  const allSeries = await getSeries(games, dataField);
  const itemsCount = new Map<number, CountData>();

  allSeries.forEach((series) => {
    series.itemsMap.forEach((countData, item) => {
      const currentItem = itemsCount.get(item);
      const currentItemCount =
        currentItem?.topSeries?.itemsMap.get(item)?.count ?? 0;
      const currentItemMinutes =
        currentItem?.topSeries?.itemsMap.get(item)?.minutes ?? 0;

      itemsCount.set(item, {
        id: item,
        count: (currentItem?.count ?? 0) + countData.count,
        topSeries:
          countData.count > currentItemCount
          || (countData.count === currentItemCount
            && countData.minutes >= currentItemMinutes)
            ? series
            : currentItem?.topSeries
      });
    });
  });

  return itemsCount
    .values()
    .toArray()
    .sort((a, b) => b.count - a.count);
};
