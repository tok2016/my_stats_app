import { AxiosRawgInstanse } from './axios-instanse';
import { MINUTES, generateErrorResponse } from './utils';

import { RawgApiListResponse } from '@ts/games/api-response';
import { GameCore, RawgGame } from '@ts/games/game';
import {
  CountData,
  MetricMap,
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

  const seriesByGame = await getGamesSeries(games);

  const iterator = (game: GameCore, map: MetricMap<CountData>) => {
    if (!(game[dataField] instanceof Array)) return;
    const series = seriesByGame[game.apiId];

    game[dataField].forEach((item) => {
      if (!map[item]) {
        map[item] = {
          id: item,
          count: 1,
          topSeries: series
        };
      } else {
        map[item].count++;
        map[item].topSeries =
          series.count > map[item].topSeries.count
          || (series.count === map[item].topSeries.count
            && series.hours >= map[item].topSeries.hours)
            ? series
            : map[item].topSeries;
      }
    });
  };

  return getMetric(games, iterator, (a, b) => b.count - a.count);
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

const getRegExpFromTitle = (title: string) => {
  const charsToRemove = /[({\['"`].*?[)}\]'"`]/g;
  const semicolons = /[:;].+/g;
  const whiteSpaces = /\s/g;
  const regexStr = title
    .replace(charsToRemove, '')
    .replace(semicolons, '')
    .trim()
    .replace(whiteSpaces, '|');
  return `(${regexStr})`;
};

const getSeriesTitle = (games: RawgGame[]) => {
  const first = games
    .slice()
    .sort(
      (a, b) => new Date(a.released).getTime() - new Date(b.released).getTime()
    )[0];

  const parts: Record<string, number> = {};
  const regex = new RegExp(getRegExpFromTitle(first.name), 'g');

  games.forEach((game) => {
    const match = game.name.match(regex)?.join(' ') ?? '';
    parts[match] = (parts[match] ?? 0) + 1;
  });

  return Object.entries(parts).reduce(
    (prev, curr) => (curr[1] > prev[1] ? curr : prev),
    ['', 0]
  )[0];
};

const getSeriesOfOneGame = async (
  game: GameCore,
  ownedGamesMap: Record<number, number>
): Promise<SeriesInverted> => {
  const searchParams = new URLSearchParams();
  searchParams.set('key', process.env.RAWG_KEY ?? '');

  const response = await AxiosRawgInstanse.get<RawgApiListResponse<RawgGame>>(
    `/games/${game.apiId}/game-series?${searchParams.toString()}`
  );

  const allGames = [
    ...response.data.results,
    {
      id: game.apiId,
      name: game.name,
      esrb_rating: { id: game.esrbRatingId ?? 0, name: '', slug: '' },
      released: game.releasedAt?.toDateString() ?? '',
      metacritic: game.metascore ?? 0,
      slug: game.name,
      game_series_count: 0,
      platforms: [],
      developers: [],
      tags: [],
      publishers: [],
      playtime: 0,
      background_image: '',
      genres: []
    }
  ];

  const gamesMap = Object.fromEntries(
    allGames
      .filter((g) => typeof ownedGamesMap[g.id] !== 'undefined')
      .map((g) => [g.id, ownedGamesMap[g.id] ?? g.playtime])
  );

  return { title: getSeriesTitle(allGames), gamesMap };
};

export const getGamesSeries = async (
  games: GameCore[]
): Promise<Record<number, SeriesShort>> => {
  const allSeries: SeriesInverted[] = [];
  const ownedGamesMap: Record<number, number> = Object.fromEntries(
    games.map((game) => [game.apiId, Math.round(game.minutes / MINUTES)])
  );

  const promises = games
    .map((game) => {
      const series = allSeries.find((s) => !!s.gamesMap[game.apiId]);
      if (!series) return getSeriesOfOneGame(game, ownedGamesMap);
    })
    .filter((promise) => !!promise);

  (await Promise.all(promises)).forEach((s) => allSeries.push(s));

  const seriesByGame: Record<number, SeriesShort> = {};
  allSeries.forEach((series) => {
    const seriesPlaytime = Object.values(series.gamesMap).reduce(
      (prev, curr) => prev + curr,
      0
    );

    Object.entries(series.gamesMap).forEach(([gameApiId], _, arr) => {
      const parsedId = parseInt(gameApiId) ?? 0;
      seriesByGame[parsedId] = {
        title: series.title,
        count: arr.length,
        hours: seriesPlaytime
      };
    });
  });

  return seriesByGame;
};
