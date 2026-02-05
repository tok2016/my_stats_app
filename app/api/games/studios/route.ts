import { NextResponse } from 'next/server';

import { GameCore, IgdbGameRatings } from '@ts/games/game';
import { IgdbStudio, StudioShort } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getAverageRating } from '@lib/games-utils';
import { igdbRequest } from '@lib/igdb';

const getStudiosResponse = async (games: GameCore[]) => {
  const studiosIds = new Set<number>();

  games.forEach((game) => {
    const gameStudios = [...game.developersIds, ...game.publishersIds];
    gameStudios.forEach((studio) => {
      studiosIds.add(studio);
    });
  });

  const studios = await igdbRequest<IgdbStudio>('/companies', {
    fields: [
      'name',
      'country',
      'developed.rating',
      'developed.aggregated_rating',
      'published.rating',
      'published.aggregated_rating',
      'logo.url'
    ],
    where: `id = (${studiosIds.values().toArray().join(',')})`,
    limit: studiosIds.size
  });

  const studiosMap: Record<number, StudioShort> = Object.fromEntries(
    studios.map((studio): [number, StudioShort] => {
      const developed = studio.developed ?? [];
      const published = studio.published ?? [];

      return [
        studio.id,
        {
          ...studio,
          logo: studio.logo?.url,
          developed: developed.length,
          published: published.length,
          criticsRating: getAverageRating<IgdbGameRatings>(
            [...developed, ...published],
            'aggregated_rating'
          ),
          usersRating: getAverageRating<IgdbGameRatings>(
            [...developed, ...published],
            'aggregated_rating'
          )
        }
      ];
    })
  );

  return NextResponse.json(studiosMap, {
    status: 200,
    statusText: 'Studios were found'
  });
};

export const GET = gameEndpoint(getStudiosResponse);
