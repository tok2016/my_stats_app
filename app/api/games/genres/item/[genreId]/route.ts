import { NextRequest, NextResponse } from 'next/server';

import Genre, { IgdbGenre } from '@ts/games/genre';
import { IgdbSeries } from '@ts/games/series';
import Token from '@ts/users/token';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games-utils';

type GenreParams = {
  genreId?: string;
};

const getGenreByApiId = async (
  token: Token,
  _req: NextRequest,
  params?: GenreParams
) => {
  const [basicInfo] = await getItemById<IgdbGenre>(
    token,
    ['genresIds'],
    ['name'],
    params?.genreId
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
