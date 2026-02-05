import { NextResponse } from 'next/server';

import { GameCore, IgdbGameRatingsStudios } from '@ts/games/game';
import { IgdbSeriesExpanded, SeriesCollapsed } from '@ts/games/series';
import { IgdbStudioBase } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { SERIES_EXPANDED_FIELDS, getAverageRating } from '@lib/games-utils';
import { igdbRequest } from '@lib/igdb';
import { MINUTES } from '@lib/utils';

const TOP_SERIES = 5;

const getSeriesInfo = (
  igdbSeries: IgdbSeriesExpanded,
  gamesMap: Map<number, GameCore>
): SeriesCollapsed => {
  const ownedGames = igdbSeries.games
    .map((game) => gamesMap.get(game.id))
    .filter((game) => !!game)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  if (typeof ownedGames[0].rating !== 'number')
    ownedGames.sort((a, b) => b.minutes - a.minutes);

  const developers = new Set<IgdbStudioBase>();
  const publishers = new Set<IgdbStudioBase>();

  igdbSeries.games.forEach((game) => {
    game.involved_companies?.forEach((involved) => {
      if (involved.developer) developers.add(involved.company);
      if (involved.publisher) publishers.add(involved.company);
    });
  });

  const fullSeries: SeriesCollapsed = {
    id: igdbSeries.id,
    name: igdbSeries.name,
    games: ownedGames.map((game) => game.id),
    allGames: igdbSeries.games.length,
    developers: developers.values().toArray(),
    publishers: publishers.values().toArray(),
    hours: Math.round(
      ownedGames
        .map((game) => game.minutes)
        .reduce((prev, curr) => prev + curr, 0) / MINUTES
    ),
    averageRating: getAverageRating<GameCore>(ownedGames, 'rating'),
    criticsRating: getAverageRating<IgdbGameRatingsStudios>(
      igdbSeries.games,
      'aggregated_rating'
    ),
    usersRating: getAverageRating<IgdbGameRatingsStudios>(
      igdbSeries.games,
      'rating'
    )
  };

  return fullSeries;
};

const getTopSeries = async (games: GameCore[]) => {
  const seriesMap = new Map<number, number>();
  const gamesMap = new Map<number, GameCore>();

  games.forEach((game) => {
    if (!game.seriesId) return;
    const seriesCount = seriesMap.get(game.seriesId) ?? 0;
    seriesMap.set(game.seriesId, seriesCount + 1);
    gamesMap.set(game.apiId, game);
  });

  const topSeries = seriesMap
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
    .map((igdbSeries) => getSeriesInfo(igdbSeries, gamesMap))
    .sort((a, b) => b.games.length - a.games.length);

  return NextResponse.json(series, {
    status: 200,
    statusText: 'TOP-5 game series was calculated'
  });
};

export const GET = gameEndpoint(getTopSeries);
