import { AxiosRawgInstanse } from './axios-instanse';
import { MINUTES, generateErrorResponse } from './utils';

import { RawgApiListResponse } from '@ts/games/api-response';
import { GameCore, RawgGame } from '@ts/games/game';
import {
  CountData,
  Metric,
  PeriodTops,
  PeriodTopsMetric,
  PlaytimeData,
  PrecisePeriod
} from '@ts/games/metric';
import { Entries } from '@ts/util-types';

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
  iterator: (game: GameCore, initialMap: Metric<MetricData>) => void,
  comparor: (a: MetricData, b: MetricData) => number,
  sort?: (entries: Entries<MetricData>) => Entries<MetricData>
): Metric<MetricData> => {
  const itemsMap: Metric<MetricData> = {};
  const bindIterator = (game: GameCore) => iterator(game, itemsMap);
  games.forEach(bindIterator);

  const sortedEntries =
    sort?.(Object.entries(itemsMap))
    ?? Object.entries(itemsMap).sort((a, b) => comparor(a[1], b[1]));

  return Object.fromEntries(sortedEntries);
};

export const getCountMetric = async (
  games: GameCore[],
  dataField: keyof GameCore
): Promise<Metric<CountData>> => {
  if (isUnacceptableField(games[0], dataField))
    throw generateErrorResponse(500, 'Internal server error');

  const seriesByGame = await getGamesSeries(games);

  const iterator = (game: GameCore, map: Metric<CountData>) => {
    if (!(game[dataField] instanceof Array)) return;
    const series = seriesByGame[game.apiId];

    game[dataField].forEach((item) => {
      map[item] = {
        count: (map[item]?.count ?? 0) + 1,
        topSeries:
          series.count > (map[item]?.count ?? 0) ? series : map[item].topSeries
      };
    });
  };

  return getMetric(games, iterator, (a, b) => a.count - b.count);
};

export const getPlaytimeMetric = (
  games: GameCore[],
  dataField: keyof GameCore
): Metric<PlaytimeData> => {
  if (isUnacceptableField(games[0], dataField))
    throw generateErrorResponse(500, 'Internal server error');

  const iterator = (game: GameCore, map: Metric<PlaytimeData>) => {
    if (!(game[dataField] instanceof Array)) return;

    game[dataField].forEach((item) => {
      map[item] = {
        hours: (map[item]?.hours ?? 0) + Math.round(game.minutes / MINUTES),
        topGame:
          game.minutes >= (map[item]?.topGame.minutes ?? 0)
            ? game
            : map[item].topGame
      };
    });
  };

  return getMetric(games, iterator, (a, b) => a.hours - b.hours);
};

export const getPeriodMetric = <MetricType>(
  games: GameCore[],
  periodType: PrecisePeriod,
  iterator: (game: GameCore, periodLists: PeriodTops<MetricType>) => void,
  topGenerator: ([year, list]: [string, MetricType]) => [string, MetricType]
): PeriodTopsMetric<MetricType> => {
  const periodLists: PeriodTops<MetricType> = {};
  const bindIterator = (game: GameCore) => iterator(game, periodLists);

  games.forEach(bindIterator);

  const periodEntries = Object.entries(periodLists).map(topGenerator);

  return {
    period: periodType,
    tops: Object.fromEntries(periodEntries)
  };
};

//fix this!!!
const getGameSeriesList = async (game: GameCore): Promise<SeriesInverted> => {
  const searchParams = new URLSearchParams();
  searchParams.set('key', process.env.RAWG_KEY ?? '');

  const response = await AxiosRawgInstanse.get<RawgApiListResponse<RawgGame>>(
    `/games/${game.apiId}/game-series?${searchParams.toString()}`
  );

  console.log(response.data.results);

  const title =
    response.data.results
      .slice()
      .sort(
        (a, b) =>
          new Date(a.released).getTime() - new Date(b.released).getTime()
      )[0]?.name ?? game.name;

  return {
    title,
    gamesMap: { [game.apiId]: 1 }
  };
};

export const getGamesSeries = async (
  games: GameCore[]
): Promise<Record<number, SeriesShort>> => {
  const allSeries: SeriesInverted[] = [];

  const promises = games
    .map((game) => {
      const series = allSeries.find((s) => !!s.gamesMap[game.apiId]);

      if (!series) return getGameSeriesList(game);
      series.gamesMap[game.apiId] = 1;
    })
    .filter((promise) => !!promise);

  (await Promise.all(promises)).forEach((s) => allSeries.push(s));

  const seriesByGame: Record<number, SeriesShort> = {};
  allSeries.forEach((series) => {
    Object.keys(series.gamesMap).forEach((gameApiId, _, arr) => {
      const parsedId = parseInt(gameApiId) ?? 0;
      seriesByGame[parsedId] = {
        title: series.title,
        count: arr.length
      };
    });
  });

  return seriesByGame;
};
