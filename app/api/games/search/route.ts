import { NextRequest, NextResponse } from 'next/server';

import { IgdbGameFull, SearchGame } from '@ts/games/game';
import Token from '@ts/users/token';

import { getCredentialsById } from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { FULL_GAME_FIELDS } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { MILLISECONDS } from '@lib/utils';

const SEARCHED_GAMES_LIMIT = 10;

export const searchForGames = async (token: Token, req: NextRequest) => {
  const query = req.nextUrl.searchParams.get('query');
  const page = req.nextUrl.searchParams.get('page') ?? '1';
  if (!query)
    return NextResponse.json([], {
      status: 200,
      statusText: 'No games were found'
    });

  await getCredentialsById(token.id);

  const searchedGames = await igdbRequest<IgdbGameFull>('/games', {
    fields: FULL_GAME_FIELDS,
    where: 'game_type.type = "Main Game"',
    search: `"${query.toLowerCase().trim()}"`,
    limit: SEARCHED_GAMES_LIMIT,
    offset: (Number(page) - 1) * SEARCHED_GAMES_LIMIT
  });

  if (!searchedGames)
    return NextResponse.json([], {
      status: 200,
      statusText: 'No games were found'
    });

  const games: SearchGame[] = searchedGames.map((game) => ({
    apiId: game.id,
    name: game.name,
    platforms: game.platforms,
    genres: game.genres,
    developers:
      game.involved_companies?.filter((company) => company.developer) ?? [],
    publishers:
      game.involved_companies?.filter((company) => company.publisher) ?? [],
    series: game.collections
      ?.slice()
      .sort((a, b) => b.games.length - a.games.length)[0],
    releasedAt: game.first_release_date
      ? new Date(game.first_release_date * MILLISECONDS)
      : undefined,
    cover: game.cover?.url
  }));

  return NextResponse.json(games, {
    status: 200,
    statusText: `Games with the name "${query}" were found`
  });
};

export const GET = protectedEndpoint(searchForGames);
