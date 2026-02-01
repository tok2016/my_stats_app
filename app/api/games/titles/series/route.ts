import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import Series, { IgdbSeries } from '@ts/games/series';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/igdb';
import { MINUTES, mean } from '@lib/utils';

const TOP_SERIES = 5;

const setGamesStudiosIds = (
  gameStudiosIds: number[],
  seriesStudiosIds: number[]
) => {
  gameStudiosIds.forEach((studioId) => {
    seriesStudiosIds.push(studioId);
  });
};

const getTopSeries = async (games: GameCore[]) => {
  const seriesMap = new Map<number, number>();
  const gamesMap = new Map<number, GameCore>();

  games.forEach((game) => {
    if (!game.seriesId) return;
    const seriesCount = seriesMap.get(game.seriesId) ?? 0;
    seriesMap.set(game.seriesId, seriesCount + 1);
    gamesMap.set(game.apiId, game);
  });

  const topSeries = seriesMap
    .entries()
    .toArray()
    .filter((series) => series[1] > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_SERIES)
    .map((entry) => entry[0]);

  const allIgdbSeries = await igdbRequest<IgdbSeries>('/collections', {
    fields: ['games', 'name'],
    where: `id = (${topSeries.join(',')})`,
    limit: topSeries.length
  });

  const series: Series[] = allIgdbSeries
    .map((igdbSeries) => {
      const ownedGames = igdbSeries.games
        .map((gameApiId) => gamesMap.get(gameApiId))
        .filter((game) => !!game)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      if (typeof ownedGames[0].rating !== 'number')
        ownedGames.sort((a, b) => b.minutes - a.minutes);

      const developers: number[] = [];
      const publishers: number[] = [];

      ownedGames.forEach((game) => {
        setGamesStudiosIds(game.developersIds, developers);
        setGamesStudiosIds(game.publishersIds, publishers);
      });

      return {
        id: igdbSeries.id,
        name: igdbSeries.name,
        slig: igdbSeries.slug,
        games: ownedGames.map((game) => game.id),
        allGames: igdbSeries.games.length,
        developers,
        publishers,
        hours: Math.round(
          ownedGames
            .map((game) => game.minutes)
            .reduce((prev, curr) => prev + curr, 0) / MINUTES
        ),
        metascore: mean(
          ownedGames
            .map((game) => game.metascore)
            .filter((metascore) => typeof metascore === 'number')
        ),
        rating: mean(
          ownedGames
            .map((game) => game.rating)
            .filter((rating) => typeof rating === 'number')
        )
      };
    })
    .sort((a, b) => b.games.length - a.games.length);

  return NextResponse.json(series, {
    status: 200,
    statusText: 'TOP-5 game series was calculated'
  });
};

export const GET = gameEndpoint(getTopSeries);
