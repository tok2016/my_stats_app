import { NextResponse } from 'next/server';

import { RawgApiListResponse } from '@ts/games/api-response';
import { GameCore } from '@ts/games/game';
import { RawgGenre } from '@ts/games/genre';

import { AxiosRawgInstanse } from '@lib/axios-instanse';
import { gameEndpoint } from '@lib/endpoint-generators';

const getGenres = async (games: GameCore[]) => {
  const genresIds: Record<number, number> = [];
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresIds[genre] = 1;
    });
  });

  const searchParams = new URLSearchParams({
    key: process.env.RAWG_KEY ?? ''
  });

  const allGenres = await AxiosRawgInstanse.get<RawgApiListResponse<RawgGenre>>(
    `/genres?${searchParams.toString()}`
  );

  const genres: RawgGenre[] = allGenres.data.results
    .map((genre) => ({
      id: genre.id,
      name: genre.name,
      slug: genre.slug
    }))
    .filter((genre) => !!genresIds[genre.id]);

  return NextResponse.json(genres, {
    status: 200,
    statusText: 'Genres were found'
  });
};

export const GET = gameEndpoint(getGenres);
