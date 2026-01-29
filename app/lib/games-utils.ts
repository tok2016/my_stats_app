import { GameCore } from '@ts/games/game';
import { CountData, MetricMap, PlaytimeData } from '@ts/games/metric';
import { IgdbSeries, ItemSeries, SeriesCompareData } from '@ts/games/series';
import { Entries } from '@ts/util-types';

import { igdbRequest } from './igdb';
import { MINUTES, generateErrorResponse } from './utils';

export const TOP_ENTRIES = 3;
export const GAMES_IN_METRIC = 5;
export const ITEMS_IN_RATING = 5;

const AcceptableArrayTypes = ['number', 'string'];

const isUnacceptableField = (
  game: GameCore | undefined,
  dataField: keyof GameCore
) =>
  game
  && !(
    game[dataField] instanceof Array
    && AcceptableArrayTypes.includes(typeof game[dataField][0])
  );

export const getMetric = <MetricData>(
  games: GameCore[],
  iterator: (game: GameCore, initialMap: MetricMap<MetricData>) => void,
  comparor: (a: MetricData, b: MetricData) => number,
  sort?: (entries: Entries<MetricData>) => MetricData[]
): MetricData[] => {
  const itemsMap: MetricMap<MetricData> = {};
  const bindIterator = (game: GameCore) => iterator(game, itemsMap);
  games.forEach(bindIterator);

  const sortedItems =
    sort?.(Object.entries(itemsMap))
    ?? Object.entries(itemsMap)
      .map((entry) => entry[1])
      .sort(comparor);

  return sortedItems;
};

export const getCountMetric = async (
  games: GameCore[],
  dataField: keyof GameCore
): Promise<CountData[]> => {
  if (isUnacceptableField(games[0], dataField))
    throw generateErrorResponse(500, 'Internal server error');

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

export const getPlaytimeMetric = (
  games: GameCore[],
  dataField: keyof GameCore
): PlaytimeData[] => {
  if (isUnacceptableField(games[0], dataField))
    throw generateErrorResponse(500, 'Internal server error');

  const iterator = (game: GameCore, map: MetricMap<PlaytimeData>) => {
    if (!(game[dataField] instanceof Array)) return;

    game[dataField].forEach((item) => {
      const hours = Math.round(game.minutes / MINUTES);
      if (!map[item]) {
        map[item] = {
          id: item,
          hours,
          topGame: game
        };
      } else {
        map[item].hours += hours;
        map[item].topGame =
          game.minutes >= map[item].topGame.minutes ? game : map[item].topGame;
      }
    });
  };

  return getMetric(games, iterator, (a, b) => b.hours - a.hours);
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
    const itemsCountMap = new Map<number, SeriesCompareData>();

    igdbSeries.games.forEach((gameApiId) => {
      const game = gamesMap.get(gameApiId);
      if (game && game[dataField] instanceof Array) {
        game[dataField].forEach((item) => {
          const currentItem = itemsCountMap.get(item);

          itemsCountMap.set(item, {
            count: (currentItem?.count ?? 0) + 1,
            minutes: (currentItem?.minutes ?? 0) + game.minutes
          });
        });
      }

      gamesMap.delete(gameApiId);
    });

    return {
      id: igdbSeries.id,
      name: igdbSeries.name,
      itemsMap: itemsCountMap
    };
  });

  gamesMap.forEach((game) => {
    if (game[dataField] instanceof Array) {
      const itemsMap = new Map<number, SeriesCompareData>(
        game[dataField].map((item) => [
          item,
          { count: 1, minutes: game.minutes }
        ])
      );

      series.push({ id: 0, name: game.name, itemsMap });
    }
  });

  return series;
};
