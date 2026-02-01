import { NextResponse } from 'next/server';

import Game, { GameCore, IgdbGameFull } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/igdb';
import { MINUTES } from '@lib/utils';

const getTopGamesByPlaytime = async (games: GameCore[]) => {
  const gamesMap = new Map<number, GameCore>();

  games.forEach((game) => {
    gamesMap.set(game.apiId, game);
  });

  const igdbGames = await igdbRequest<IgdbGameFull>('/games', {
    fields: [
      'name',
      'slug',
      'cover.url',
      'first_release_date',
      'platforms.name',
      'platforms.slug',
      'platforms.platform_family.name',
      'platforms.platform_family.slug',
      'platforms.platform_logo.url',
      'collections.games',
      'collections.name',
      'collections.slug',
      'genres.name',
      'genres.slug',
      'involved_companies.developer',
      'involved_companies.publisher',
      'involved_companies.company.name',
      'involved_companies.company.slug',
      'involved_companies.company.country'
    ],
    where: `id = (${gamesMap.keys().toArray().join(',')})`,
    limit: games.length
  });

  for (const game of igdbGames)
    for (const comp of game.involved_companies ?? []) {
      console.log(`${comp.developer || comp.publisher}`);
      console.log(comp.company);
    }

  const fullGamesEntries = igdbGames
    .map((igdbGame) => {
      const game = gamesMap.get(igdbGame.id);
      if (!game) return;

      const fullGame: Game = {
        id: game.id,
        name: game.name,
        apiId: game.apiId,
        rating: game.rating,
        releasedAt: game.releasedAt,
        hours: Math.round(game.minutes / MINUTES),
        playDate: game.playDate,
        metascore: game.metascore,
        developers:
          igdbGame.involved_companies
            ?.filter((studio) => studio.developer)
            .map((studio) => studio.company) ?? [],
        publishers:
          igdbGame.involved_companies
            ?.filter((studio) => studio.publisher)
            .map((studio) => studio.company) ?? [],
        platform: igdbGame.platforms.find(
          (igdbPlatform) => igdbPlatform.id === game.platformId
        ),
        series: igdbGame.collections?.reduce((prev, curr) =>
          curr.games.length > prev.games.length ? curr : prev
        ),
        genres: igdbGame.genres
      };

      return [game.id, fullGame];
    })
    .filter((entry) => !!entry);

  const fullGamesMap: Record<string, Game> =
    Object.fromEntries(fullGamesEntries);

  return NextResponse.json(fullGamesMap, {
    status: 200,
    statusText: 'Games full information was found'
  });
};

export const GET = gameEndpoint(getTopGamesByPlaytime);
