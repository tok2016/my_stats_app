import { NextResponse } from 'next/server';

import { IgdbGameFull, SearchGame, SearchGamesResults } from '@ts/games/game';
import { ProtectedEndpointAction } from '@ts/requests';

import { getCredentialsById } from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { FULL_GAME_FIELDS } from '@lib/games/games-utils';
import { getImageUrl, igdbRequest } from '@lib/games/igdb';
import { MILLISECONDS } from '@lib/utils';

const SEARCHED_GAMES_LIMIT = 10;

const searchForGames: ProtectedEndpointAction<'/api/games/search'> = async (
  req,
  _params,
  token
) => {
  const query = req.nextUrl.searchParams.get('query');
  const parsedPage = parseInt(req.nextUrl.searchParams.get('page') ?? '1');
  const page = Number.isNaN(parsedPage) ? 1 : parsedPage;

  if (!query) {
    const searchResults: SearchGamesResults = {
      games: [],
      page,
      query: '',
      isEnd: true
    };

    return NextResponse.json(searchResults, {
      status: 200,
      statusText: 'No games were found'
    });
  }

  await getCredentialsById(token.id);

  const searchedGames = await igdbRequest<IgdbGameFull>('/games', {
    fields: FULL_GAME_FIELDS,
    search: `"${query.toLowerCase().trim()}"`,
    limit: SEARCHED_GAMES_LIMIT,
    offset: (page - 1) * SEARCHED_GAMES_LIMIT
  });

  if (!searchedGames) {
    const searchResults: SearchGamesResults = {
      games: [],
      page,
      query,
      isEnd: true
    };

    return NextResponse.json(searchResults, {
      status: 200,
      statusText: 'No games were found'
    });
  }

  const games: SearchGame[] = searchedGames.map((game) => ({
    apiId: game.id,
    name: game.name,
    platforms: game.platforms,
    genres: game.genres ?? [],
    developers:
      game.involved_companies
        ?.filter((company) => company.developer)
        .map((company) => company.company) ?? [],
    publishers:
      game.involved_companies
        ?.filter((company) => company.publisher)
        .map((company) => company.company) ?? [],
    series: game.collections
      ?.slice()
      .sort((a, b) => b.games.length - a.games.length)[0],
    releasedAt: game.first_release_date
      ? new Date(game.first_release_date * MILLISECONDS).toISOString()
      : undefined,
    cover: game.cover
      ? {
          url: getImageUrl(game.cover.image_id, 'cover_big'),
          id: game.cover.image_id
        }
      : undefined
  }));

  const searchResults: SearchGamesResults = {
    games,
    page,
    isEnd: games.length < SEARCHED_GAMES_LIMIT,
    query
  };

  return NextResponse.json(searchResults, {
    status: 200,
    statusText: `Games with the name "${query}" were found`
  });
};

export const GET = protectedEndpoint(searchForGames);
