import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { IgdbPlatform } from '@ts/games/platform';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/igdb';

const getPlatforms = async (games: GameCore[]) => {
  const platfromsIds = new Set<number>(games.map((game) => game.platformId));
  const platforms = await igdbRequest<IgdbPlatform>('/platforms', {
    fields: [
      'name',
      'slug',
      'platform_family.name',
      'platform_family.slug',
      'platform_logo'
    ],
    where: `id = (${platfromsIds.values().toArray().join(',')})`,
    limit: platfromsIds.size
  });

  const platformsMap = Object.fromEntries(
    platforms.map((platform) => [platform.id, platform])
  );
  return NextResponse.json(platformsMap, {
    status: 200,
    statusText: 'Platforms were found'
  });
};

export const GET = gameEndpoint(getPlatforms);
