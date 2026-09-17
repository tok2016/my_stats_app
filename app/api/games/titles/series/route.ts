import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { IgdbSeriesExpanded, SeriesCollapsed } from '@ts/games/series';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import {
  SERIES_EXPANDED_FIELDS,
  getAverageRating
} from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';

const TOP_SERIES = 5;

/**
 * Calculates series data.
 * @param igdbSeries - Series data from IGDB with all games.
 * @param games - All users games.
 * @returns Series detailed data.
 */
const getSeriesInfo = (
  igdbSeries: IgdbSeriesExpanded,
  games: ObjectMapArray<GameCore, 'apiId'>
): SeriesCollapsed => {
  //Filters series games that the user has and sorts them by rating and playtime.
  const ownedGames = new ObjectMapArray(
    igdbSeries.games
      .map((game) => games.findByKey(game.id))
      .filter((game) => !!game),
    'id'
  ).sort((a, b) => {
    const diff = (b.rating ?? 0) - (a.rating ?? 0);
    if (!diff) return b.hours - a.hours;
    return diff;
  });

  //Distributes developers and publishers of series games.
  const developers = new ObjectMapArray<
    SeriesCollapsed['developers'][number],
    'id'
  >([], 'id');
  const publishers = new ObjectMapArray<
    SeriesCollapsed['publishers'][number],
    'id'
  >([], 'id');

  igdbSeries.games.forEach((game) => {
    game.involved_companies?.forEach((involved) => {
      if (involved.developer) developers.push(involved.company);
      if (involved.publisher) publishers.push(involved.company);
    });
  });

  //Calculates mean ratings.
  const fullSeries: SeriesCollapsed = {
    id: igdbSeries.id,
    name: igdbSeries.name,
    games: ownedGames.map((game) => game.id).toArray(),
    allGames: igdbSeries.games.length,
    developers: developers.toArray(),
    publishers: publishers.toArray(),
    hours: ownedGames.reduceByKey('hours', (prev, curr) => prev + curr, 0),
    averageRating: getAverageRating(ownedGames, 'rating'),
    criticsRating: getAverageRating(igdbSeries.games, 'aggregated_rating'),
    usersRating: getAverageRating(igdbSeries.games, 'rating')
  };

  return fullSeries;
};

/**
 * Public method. Calculates top series by games count.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top series by games count.
 */
const getTopSeries: GameEndpointAction<'/api/games/titles/series'> = async (
  _req,
  _params,
  games
) => {
  //Groups games by series with their count.
  const seriesCountMap = new Map<number, number>();

  games.forEach((game) => {
    if (!game.seriesId) return;
    const seriesCount = seriesCountMap.get(game.seriesId) ?? 0;
    seriesCountMap.set(game.seriesId, seriesCount + 1);
  });

  //Filters series with games more than 1 and sorts them by games count.
  const topSeries = seriesCountMap
    .entries()
    .toArray()
    .filter((series) => series[1] > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_SERIES)
    .map((entry) => entry[0]);

  //Fetches all games of series from IGDB.
  const allIgdbSeries = await igdbRequest<IgdbSeriesExpanded>('/collections', {
    fields: SERIES_EXPANDED_FIELDS,
    where: `id = (${topSeries.join(',')})`
  });

  const series: SeriesCollapsed[] = allIgdbSeries.map((igdbSeries) =>
    getSeriesInfo(igdbSeries, games)
  );

  return NextResponse.json(series, {
    status: 200,
    statusText: 'TOP-5 game series was calculated'
  });
};

export const GET = gameMetricEndpoint(getTopSeries);
