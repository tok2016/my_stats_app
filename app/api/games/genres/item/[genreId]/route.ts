import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import Genre, { IgdbGenre } from '@ts/games/genre';
import { ItemCompareData } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameProtectedEndpoint } from '@lib/endpoint-generators';
import {
  getFullGames,
  getTopItem,
  tryGetItemById
} from '@lib/games/games-utils';

/**
 * Calculates compate data for series groups.
 * @param game - Game data.
 * @param series - Series of game.
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
 * @param games - All games of user.
 * @throws 400 if genre id is not given.
 * @throws 404 if genre is not found.
 * @returns Genre full data.
 */
const getGenreByApiId: GameEndpointAction<
  '/api/games/genres/item/[genreId]'
> = async (_req, params, games) => {
  //Fetch genres from IGDB.
  const { genreId } = await params;

  const gamesFull = await getFullGames(games);
  const [basicInfo] = await tryGetItemById<IgdbGenre>(
    gamesFull,
    'genres',
    Number(genreId),
    ['name']
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

export const GET = gameProtectedEndpoint(getGenreByApiId);
