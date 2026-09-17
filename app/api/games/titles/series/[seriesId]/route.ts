import { NextResponse } from 'next/server';

import Series, { IgdbSeriesExpanded } from '@ts/games/series';
import { IgdbStudioBase } from '@ts/games/studio';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import {
  SERIES_EXPANDED_FIELDS,
  getAverageRating,
  tryGetItemById
} from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';

/**
 * Protected method. Finds and calculates series data by id.
 * @param _req - Request object.
 * @param params - Route params with series id.
 * @param token - Token object.
 * @throws 400 if series id is not given.
 * @returns Series full data.
 */
const getSeriesById: ProtectedEndpointAction<
  '/api/games/titles/series/[seriesId]'
> = async (_req, params, token) => {
  //Fetches series data from IGDB.
  const { seriesId } = await params;
  const [basicInfo, igdbSeries] = await tryGetItemById<IgdbSeriesExpanded>(
    token,
    ['seriesId'],
    SERIES_EXPANDED_FIELDS,
    seriesId
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

export const GET = protectedEndpoint(getSeriesById);
