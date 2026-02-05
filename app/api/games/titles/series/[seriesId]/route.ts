import { NextRequest, NextResponse } from 'next/server';

import { IgdbGameRatingsStudios } from '@ts/games/game';
import Series, { IgdbSeriesExpanded } from '@ts/games/series';
import { IgdbStudioBase } from '@ts/games/studio';
import Token from '@ts/users/token';

import { protectedEndpoint } from '@lib/endpoint-generators';
import {
  SERIES_EXPANDED_FIELDS,
  getAverageRating,
  getItemById
} from '@lib/games-utils';

type SeriesParams = {
  seriesId?: string;
};

const getSeriesById = async (
  token: Token,
  _req: NextRequest,
  params?: SeriesParams
) => {
  const [basicInfo, igdbSeries] = await getItemById<IgdbSeriesExpanded>(
    token,
    ['seriesId'],
    SERIES_EXPANDED_FIELDS,
    params?.seriesId
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
    criticsRating: getAverageRating<IgdbGameRatingsStudios>(
      igdbSeries.games,
      'aggregated_rating'
    ),
    usersRating: getAverageRating<IgdbGameRatingsStudios>(
      igdbSeries.games,
      'rating'
    )
  };

  return NextResponse.json(series, {
    status: 200,
    statusText: 'Studio was found'
  });
};

export const GET = protectedEndpoint(getSeriesById);
