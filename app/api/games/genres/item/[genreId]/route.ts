import { NextResponse } from 'next/server';

import Genre, { IgdbGenre } from '@ts/games/genre';
import { IgdbSeries } from '@ts/games/series';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games/games-utils';

const getGenreByApiId: ProtectedEndpointAction<
  '/api/games/genres/item/[genreId]'
> = async (_req, params, token) => {
  const { genreId } = await params;

  const [basicInfo] = await getItemById<IgdbGenre>(
    token,
    ['genresIds'],
    ['name'],
    genreId
  );

  const genre: Genre = {
    ...basicInfo,
    topSeries: getTopItem<IgdbSeries>(basicInfo.games, 'series')
  };

  return NextResponse.json(genre, {
    status: 200,
    statusText: 'Genre was found'
  });
};

export const GET = protectedEndpoint(getGenreByApiId);
