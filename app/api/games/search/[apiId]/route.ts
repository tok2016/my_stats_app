import { NextRequest, NextResponse } from 'next/server';

import { IgdbGameFull, SearchGame } from '@ts/games/game';
import Token from '@ts/users/token';

import { getCredentialsById } from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { FULL_GAME_FIELDS } from '@lib/games/games-utils';
import { getImageUrl, igdbRequest } from '@lib/games/igdb';
import { MILLISECONDS, generateErrorResponse } from '@lib/utils';

type SearchGameParams = {
  apiId?: string;
};

export const searchForGames = async (
  token: Token,
  req: NextRequest,
  params?: SearchGameParams
) => {
  if (!params?.apiId) throw generateErrorResponse(400, 'ID was not provided');

  await getCredentialsById(token.id);

  const searchedGame = (
    await igdbRequest<IgdbGameFull>('/games', {
      fields: FULL_GAME_FIELDS,
      where: `id = ${params.apiId}`
    })
  )[0];

  if (!searchedGame) throw generateErrorResponse(404, 'Game was not found');

  const games: SearchGame = {
    apiId: searchedGame.id,
    name: searchedGame.name,
    platforms: searchedGame.platforms,
    genres: searchedGame.genres,
    developers:
      searchedGame.involved_companies?.filter((company) => company.developer)
      ?? [],
    publishers:
      searchedGame.involved_companies?.filter((company) => company.publisher)
      ?? [],
    series: searchedGame.collections
      ?.slice()
      .sort((a, b) => b.games.length - a.games.length)[0],
    releasedAt: searchedGame.first_release_date
      ? new Date(searchedGame.first_release_date * MILLISECONDS)
      : undefined,
    cover: searchedGame.cover?.image_id
      ? getImageUrl(searchedGame.cover.image_id, 'cover_big')
      : undefined
  };

  return NextResponse.json(games, {
    status: 200,
    statusText: 'Game was found by API ID'
  });
};

export const GET = protectedEndpoint(searchForGames);
