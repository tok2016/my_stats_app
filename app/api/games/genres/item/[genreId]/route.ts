import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import Genre, { IgdbGenre } from '@ts/games/genre';
import { ItemCompareData } from '@ts/games/metric';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getTopItem, tryGetItemById } from '@lib/games/games-utils';

/**
 * Calculates compate data for series groups.
 * @param game - Game data.
 * @param series - Series id of game.
 * @param stored - Previously stored series group.
 * @returns Series group with aggregated data.
 */
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

/**
 * Protected method. Finds and calculates genre data by id.
 * @param _req - Request object.
 * @param params - Route params with genre id.
 * @param token - Token object.
 * @throws 400 if genre id is not given.
 * @returns Genre full data.
 */
const getGenreByApiId: ProtectedEndpointAction<
  '/api/games/genres/item/[genreId]'
> = async (_req, params, token) => {
  //Fetch genres from IGDB.
  const { genreId } = await params;

  const [basicInfo] = await tryGetItemById<IgdbGenre>(
    token,
    ['genresIds'],
    ['name'],
    genreId
  );

  //Finds top series by games count of genre.
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
