import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/igdb';

const getGenres = async (games: GameCore[]) => {
  const genresIds: Record<number, number> = {};
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresIds[genre] = 1;
    });
  });

  const genres = await igdbRequest<IgdbGenre>('/genres', {
    fields: ['name', 'slug'],
    where: `id = (${Object.keys(genresIds).join(',')})`,
    limit: Object.keys(genresIds).length
  });

  const genresMap: Record<number, IgdbGenre> = Object.fromEntries(
    genres.map((genre) => [genre.id, genre])
  );

  return NextResponse.json(genresMap, {
    status: 200,
    statusText: 'Genres were found'
  });
};

export const GET = gameEndpoint(getGenres);
