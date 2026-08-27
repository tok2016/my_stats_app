import { NextResponse } from 'next/server';

import Series, { IgdbSeriesExpanded } from '@ts/games/series';
import { IgdbStudioBase } from '@ts/games/studio';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import {
  SERIES_EXPANDED_FIELDS,
  getAverageRating,
  getItemById
} from '@lib/games/games-utils';

const getSeriesById: ProtectedEndpointAction<
  '/api/games/titles/series/[seriesId]'
> = async (_req, params, token) => {
  const { seriesId } = await params;
  const [basicInfo, igdbSeries] = await getItemById<IgdbSeriesExpanded>(
    token,
    ['seriesId'],
    SERIES_EXPANDED_FIELDS,
    seriesId
  );

  const developers = new Set<IgdbStudioBase>();
  const publishers = new Set<IgdbStudioBase>();

  igdbSeries.games.forEach((game) => {
    game.involved_companies?.forEach((involved) => {
      if (involved.developer) developers.add(involved.company);
      if (involved.publisher) publishers.add(involved.company);
    });
  });

  const series: Series = {
    ...basicInfo,
    allGames: igdbSeries.games.length,
    developers: developers.values().toArray(),
    publishers: publishers.values().toArray(),
    criticsRating: getAverageRating(igdbSeries.games, 'aggregated_rating'),
    usersRating: getAverageRating(igdbSeries.games, 'rating')
  };

  return NextResponse.json(series, {
    status: 200,
    statusText: 'Studio was found'
  });
};

export const GET = protectedEndpoint(getSeriesById);
