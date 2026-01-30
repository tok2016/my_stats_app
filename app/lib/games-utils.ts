import { GameCore, GameShort } from '@ts/games/game';
import {
  CountCompareData,
  CountData,
  MetricMap,
  PeriodTops,
  PeriodTopsMetric,
  PlaytimeData,
  PrecisePeriod,
  RatingData
} from '@ts/games/metric';
import { IgdbSeries, ItemSeries } from '@ts/games/series';
import { Entries, RequiredFields } from '@ts/util-types';

import { igdbRequest } from './igdb';
import { MINUTES, generateErrorResponse, getPeriodDate, mean } from './utils';

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
    const itemsCountMap = new Map<number, CountCompareData>();

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
      const itemsMap = new Map<number, CountCompareData>(
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

export const getPeriodMetric = (
  games: GameCore[],
  periodType: PrecisePeriod,
  dataField: keyof GameCore,
  maxTopEntries: number
): PeriodTopsMetric<string> => {
  if (isUnacceptableField(games[0], dataField))
    throw generateErrorResponse(500, 'Internal server error');

  const periodLists = new Map<string, MetricMap<number>>();

  games.forEach((game) => {
    if (
      game.playDate
      && game.playDate.getTime()
      && game[dataField] instanceof Array
    ) {
      const period = getPeriodDate[periodType](game.playDate);

      game[dataField].forEach((item) => {
        const periodList = periodLists.get(period);
        const currentGameTime = Math.round(game.minutes / MINUTES);

        periodLists.set(period, {
          ...periodLists.get(period),
          [item]: (periodList?.[item] ?? 0) + currentGameTime
        });
      });
    }
  });

  const periodTops = periodLists
    .entries()
    .map(([period, list]) => {
      const top = Object.entries(list)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])
        .slice(0, maxTopEntries);

      const periodTop: PeriodTops<string> = { period, top };
      return periodTop;
    })
    .toArray()
    .sort((a, b) => (a.period >= b.period ? 1 : -1));

  return {
    periodType: periodType,
    tops: periodTops
  };
};

export const getRatingMetric = (
  games: GameCore[],
  dataField: keyof GameCore
): RatingData[] => {
  if (isUnacceptableField(games[0], dataField))
    throw generateErrorResponse(500, 'Internal server error');

  const itemsMap = new Map<number, RatingData>();

  games.forEach((game) => {
    if (!(game[dataField] instanceof Array)) return;

    game[dataField].forEach((item) => {
      const currentItemRating = itemsMap.get(item);
      if (!currentItemRating)
        itemsMap.set(item, {
          id: item,
          rating: 0,
          topGames: [game]
        });
      else currentItemRating.topGames.push(game);
    });
  });

  const ratingDataMetric = itemsMap
    .entries()
    .map(([item, ratingData]): RatingData | undefined => {
      const gamesWithRating = ratingData.topGames.filter(
        (game) => typeof game.rating === 'number'
      ) as RequiredFields<GameShort, 'rating'>[];

      const rating = mean(gamesWithRating.map((game) => game.rating));

      if (!rating) return;
      return {
        id: item,
        rating,
        topGames: gamesWithRating
          .sort((a, b) => b.rating - a.rating)
          .slice(0, GAMES_IN_METRIC)
      };
    })
    .filter((ratingData) => !!ratingData)
    .toArray()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, ITEMS_IN_RATING);

  return ratingDataMetric;
};
