import { NextResponse } from 'next/server';

import { GameCore, GameCountryMetric } from '@ts/games/game';
import { IgdbStudioCountry } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';

const GAMES_IN_COUNTRIES = 3;

const getGamesByCountries = async (games: GameCore[]) => {
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

  const developersMap = Object.fromEntries(
    developers.map((developer) => [developer.id, developer.country])
  );

  const gamesCountriesMap = new Map<number, GameCountryMetric>();
  games.forEach((game) => {
    game.developersIds.forEach((developerId) => {
      const devCountry = developersMap[developerId];
      if (!devCountry) return;

      const countryData = gamesCountriesMap.get(devCountry);

      if (!countryData)
        gamesCountriesMap.set(devCountry, {
          country: devCountry,
          count: 1,
          minutes: game.minutes,
          topGames: [game]
        });
      else {
        countryData.count++;
        countryData.minutes += game.minutes;
        countryData.topGames.push(game);
      }
    });
  });

  const countriesGames: GameCountryMetric[] = gamesCountriesMap
    .values()
    .map((countryData) => {
      const ratingTops = countryData.topGames
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .filter((game) => typeof game.rating === 'number')
        .slice(0, GAMES_IN_COUNTRIES);

      const sortedCountyData: GameCountryMetric = {
        ...countryData,
        topGames: ratingTops
      };

      return sortedCountyData;
    })
    .toArray()
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.minutes - a.minutes;
      return countDiff;
    });

  return NextResponse.json(countriesGames, {
    status: 200,
    statusText: 'Highest rated games were calculated by countries'
  });
};

export const GET = gameEndpoint(getGamesByCountries);
