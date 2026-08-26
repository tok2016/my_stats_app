import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { IgdbSeriesExpanded, SeriesCollapsed } from '@ts/games/series';

import { gameEndpoint } from '@lib/endpoint-generators';
import {
  SERIES_EXPANDED_FIELDS,
  getAverageRating
} from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';

const TOP_SERIES = 5;

const getSeriesInfo = (
  igdbSeries: IgdbSeriesExpanded,
  games: ObjectMapArray<GameCore, 'apiId'>
): SeriesCollapsed => {
  const ownedGames = new ObjectMapArray(
    igdbSeries.games
      .map((game) => games.findByKey(game.id))
      .filter((game) => !!game),
    'id'
  );

  ownedGames.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  if (typeof ownedGames.at(0)?.rating !== 'number')
    ownedGames.sort((a, b) => b.hours - a.hours);

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
      if (involved.developer && !developers.findByKey(involved.company.id))
        developers.push(involved.company);
      if (involved.publisher && !publishers.findByKey(involved.company.id))
        publishers.push(involved.company);
    });
  });

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

const getTopSeries = async (games: GameCore[]) => {
  const seriesCountMap = new Map<number, number>();
  const gamesMapArray = new ObjectMapArray<GameCore, 'apiId'>([], 'apiId');

  games.forEach((game) => {
    if (!game.seriesId) return;
    const seriesCount = seriesCountMap.get(game.seriesId) ?? 0;
    seriesCountMap.set(game.seriesId, seriesCount + 1);
    gamesMapArray.push(game);
  });

  const topSeries = seriesCountMap
    .entries()
    .toArray()
    .filter((series) => series[1] > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_SERIES)
    .map((entry) => entry[0]);

  const allIgdbSeries = await igdbRequest<IgdbSeriesExpanded>('/collections', {
    fields: SERIES_EXPANDED_FIELDS,
    where: `id = (${topSeries.join(',')})`,
    limit: topSeries.length
  });

  const series: SeriesCollapsed[] = allIgdbSeries
    .map((igdbSeries) => getSeriesInfo(igdbSeries, gamesMapArray))
    .sort((a, b) => b.games.length - a.games.length);

  return NextResponse.json(series, {
    status: 200,
    statusText: 'TOP-5 game series was calculated'
  });
};

export const GET = gameEndpoint(getTopSeries);
