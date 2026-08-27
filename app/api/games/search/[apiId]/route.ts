import { NextResponse } from 'next/server';

import { IgdbGameFull, SearchGame } from '@ts/games/game';
import { ProtectedEndpointAction } from '@ts/requests';

import { getCredentialsById } from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { FULL_GAME_FIELDS } from '@lib/games/games-utils';
import { getImageUrl, igdbRequest } from '@lib/games/igdb';
import { MILLISECONDS, generateErrorResponse } from '@lib/utils';

const searchForGameById: ProtectedEndpointAction<
  '/api/games/search/[apiId]'
> = async (_req, params, token) => {
  const { apiId } = await params;
  if (!apiId) throw generateErrorResponse(400, 'ID was not provided');

  await getCredentialsById(token.id);

  const searchedGame = (
    await igdbRequest<IgdbGameFull>('/games', {
      fields: FULL_GAME_FIELDS,
      where: `id = ${apiId}`
    })
  )[0];

  if (!searchedGame) throw generateErrorResponse(404, 'Game was not found');

  const games: SearchGame = {
    apiId: searchedGame.id,
    name: searchedGame.name,
    platforms: searchedGame.platforms,
    genres: searchedGame.genres,
    developers:
      searchedGame.involved_companies
        ?.filter((company) => company.developer)
        .map((company) => company.company) ?? [],
    publishers:
      searchedGame.involved_companies
        ?.filter((company) => company.publisher)
        .map((company) => company.company) ?? [],
    series: searchedGame.collections
      ?.slice()
      .sort((a, b) => b.games.length - a.games.length)[0],
    releasedAt: searchedGame.first_release_date
      ? new Date(searchedGame.first_release_date * MILLISECONDS).toISOString()
      : undefined,
    cover: searchedGame.cover
      ? {
          url: getImageUrl(searchedGame.cover.image_id, 'cover_big'),
          id: searchedGame.cover.image_id
        }
      : undefined
  };

  return NextResponse.json(games, {
    status: 200,
    statusText: 'Game was found by API ID'
  });
};

export const GET = protectedEndpoint(searchForGameById);
