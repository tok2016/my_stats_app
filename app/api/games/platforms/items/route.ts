import { NextResponse } from 'next/server';

import { IgdbPlatform, PlatformShort } from '@ts/games/platform';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getImageUrl, igdbRequest } from '@lib/games/igdb';
import { generateErrorResponse } from '@lib/utils';

/**
 * Finds all platforms of user's games
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game or platform of theirs is found.
 * @returns Basic data of all user's platforms.
 */
const getPlatforms: GameEndpointAction<'/api/games/platforms/items'> = async (
  _req,
  _params,
  games
) => {
  const platformsIds = new Set(
    games.map((game) => game.platformId).filter((platform) => !!platform)
  )
    .values()
    .toArray();

  if (!platformsIds.length)
    throw generateErrorResponse(404, 'No platform was found');

  const igdbPlatforms = await igdbRequest<IgdbPlatform>('/genres', {
    fields: ['name', 'platform_family.name', 'platform_logo.image_id'],
    where: `id=(${platformsIds.join(',')})`
  });

  const platforms: PlatformShort[] = igdbPlatforms.map((platform) => ({
    id: platform.id,
    name: platform.name,
    family: platform.platform_family,
    logo: platform.platform_logo
      ? getImageUrl(platform.platform_logo.image_id, 'logo_med')
      : undefined
  }));

  return NextResponse.json(platforms, {
    status: 200,
    statusText: 'Platforms were found'
  });
};

export const GET = gameMetricEndpoint(getPlatforms);
