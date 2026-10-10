import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { GameItemsData } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getFullGames } from '@lib/games/games-utils';

/**
 * Finds data of games metadata: genres, platforms, studios, series, etc.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All users games.
 * @returns Data of game metadata items: genres, platforms, studios, series, etc.
 */
const getItems: GameEndpointAction<'/api/games/items'> = async (
  _req,
  _params,
  games
) => {
  const fullGames = await getFullGames(games);

  const studios = fullGames.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game.developers,
    'id'
  );
  const publishers = fullGames.flatMapByKey<Game['publishers'][number], 'id'>(
    (game) => game.publishers,
    'id'
  );

  publishers.forEach((publisher) => {
    studios.push(publisher);
  });

  const itemsData: GameItemsData = {
    genres: fullGames
      .flatMapByKey<Game['genres'][number], 'id'>((game) => game.genres, 'id')
      .toArray(),
    studios: studios.toArray(),
    platforms: fullGames
      .mapByKey<Game['platform'], 'id'>((game) => game.platform, 'id')
      .toArray(),
    series: fullGames
      .mapByKey<Game['series'], 'id'>((game) => game.series, 'id')
      .toArray()
  };

  return NextResponse.json(itemsData, {
    status: 200,
    statusText: 'Games items data were found'
  });
};

export const GET = gameMetricEndpoint(getItems);
