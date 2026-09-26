import { NextResponse } from 'next/server';

import Series, { IgdbSeriesExpanded } from '@ts/games/series';
import { IgdbStudioBase } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameProtectedEndpoint } from '@lib/endpoint-generators';
import {
  SERIES_EXPANDED_FIELDS,
  getAverageRating,
  getFullGames,
  tryGetItemById
} from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';

/**
 * Protected method. Finds and calculates series data by id.
 * @param _req - Request object.
 * @param params - Route params with series id.
 * @param games - All games of user.
 * @throws 400 if genre id is not given.
 * @throws 404 if genre is not found.
 * @returns Series full data.
 */
const getSeriesById: GameEndpointAction<
  '/api/games/titles/series/[seriesId]'
> = async (_req, params, games) => {
  //Fetches series data from IGDB.
  const { seriesId } = await params;

  const gamesFull = await getFullGames(games);
  const [basicInfo, igdbSeries] = await tryGetItemById<IgdbSeriesExpanded>(
    gamesFull,
    'series',
    Number(seriesId),
    SERIES_EXPANDED_FIELDS
  );

  //Distributes developers and publishers of series games.
  const developers = new ObjectMapArray<IgdbStudioBase, 'id'>([], 'id');
  const publishers = new ObjectMapArray<IgdbStudioBase, 'id'>([], 'id');

  igdbSeries.games.forEach((game) => {
    game.involved_companies?.forEach((involved) => {
      if (involved.developer) developers.push(involved.company);
      if (involved.publisher) publishers.push(involved.company);
    });
  });

  //Calculates mean ratings.
  const series: Series = {
    ...basicInfo,
    allGames: igdbSeries.games.length,
    developers: developers.toArray(),
    publishers: publishers.toArray(),
    criticsRating: getAverageRating(igdbSeries.games, 'aggregated_rating'),
    usersRating: getAverageRating(igdbSeries.games, 'rating')
  };

  return NextResponse.json(series, {
    status: 200,
    statusText: 'Studio was found'
  });
};

export const GET = gameProtectedEndpoint(getSeriesById);
