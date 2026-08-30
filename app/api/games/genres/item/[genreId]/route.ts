import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import Genre, { IgdbGenre } from '@ts/games/genre';
import { ItemCompareData } from '@ts/games/metric';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games/games-utils';

const aggregateSeries = (
  game: Game,
  series: Game['series'],
  stored?: ItemCompareData<NonNullable<Game['series']>>
) => {
  if (!series) return undefined;
  return {
    ...series,
    count: (stored?.count ?? 0) + 1,
    hours: (stored?.hours ?? 0) + game.hours
  };
};

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
    topSeries: getTopItem(
      basicInfo.games.groupBy(aggregateSeries, 'series', 'id', 'id')
    )
  };

  return NextResponse.json(genre, {
    status: 200,
    statusText: 'Genre was found'
  });
};

export const GET = protectedEndpoint(getGenreByApiId);
