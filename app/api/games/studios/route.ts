import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { IgdbStudio, Studio } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/igdb';

const getStudios = async (games: GameCore[]) => {
  const studiosIds: number[] = [];

  games.forEach((game) => {
    const gameStudios = [...game.developersIds, ...game.publishersIds];
    gameStudios.forEach((studio) => {
      studiosIds.push(studio);
    });
  });

  const studios = await igdbRequest<IgdbStudio>('/companies', {
    fields: ['name', 'slug', 'country', 'developed', 'published', 'logo'],
    where: `id = (${studiosIds.join(',')})`
  });

  const studiosMap: Record<number, Studio> = Object.fromEntries(
    studios.map((studio) => [
      studio.id,
      {
        ...studio,
        developed: studio.developed?.length ?? 0,
        published: studio.published?.length ?? 0
      }
    ])
  );

  return NextResponse.json(studiosMap, {
    status: 200,
    statusText: 'Studios were found'
  });
};

export const GET = gameEndpoint(getStudios);
