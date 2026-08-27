import { NextResponse } from 'next/server';

import { GameCountryMetric, GameShort } from '@ts/games/game';
import { IgdbStudioCountry } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { gameCoreToShort } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';

const GAMES_IN_COUNTRIES = 3;
const GameSortKeys: (keyof GameShort)[] = ['hours', 'rating'];

const getGamesByCountries: GameEndpointAction<
  '/api/games/titles/countries'
> = async (_req, _params, games) => {
  const developersIds = new Set<number>();
  games.forEach((game) => {
    game.developersIds.forEach((developerId) => {
      developersIds.add(developerId);
    });
  });

  const developers = await igdbRequest<IgdbStudioCountry>('/companies', {
    fields: ['country'],
    where: `id = (${developersIds.values().toArray().join(',')})`,
    limit: developersIds.size
  });

  const developersCountriesMap = new Map<number, number | undefined>(
    developers.map((developer) => [developer.id, developer.country])
  );

  const gamesCountriesMap = new ObjectMapArray<GameCountryMetric, 'country'>(
    [],
    'country'
  );

  games.forEach((game) => {
    game.developersIds.forEach((developerId) => {
      const devCountry = developersCountriesMap.get(developerId);
      if (!devCountry) return;

      const gameShort = gameCoreToShort(game);
      const countryData = gamesCountriesMap.findByKey(devCountry);

      if (!countryData)
        gamesCountriesMap.push({
          country: devCountry,
          count: 1,
          hours: gameShort.hours,
          topGames: [gameShort]
        });
      else {
        countryData.count++;
        countryData.hours += gameShort.hours;
        countryData.topGames.push(gameShort);
      }
    });
  });

  const countriesGames: GameCountryMetric[] = gamesCountriesMap
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    })
    .map((countryData) => {
      const ratingTops = countryData.topGames
        .sort((a, b) =>
          GameSortKeys.reduce(
            (prev, curr) => prev + Number(b[curr] ?? 0) - Number(a[curr] ?? 0),
            0
          )
        )
        .slice(0, GAMES_IN_COUNTRIES);

      const sortedCountyData: GameCountryMetric = {
        ...countryData,
        topGames: ratingTops
      };

      return sortedCountyData;
    })
    .toArray();

  return NextResponse.json(countriesGames, {
    status: 200,
    statusText: 'Highest rated games were calculated by countries'
  });
};

export const GET = gameEndpoint(getGamesByCountries);
