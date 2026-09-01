import { NextResponse } from 'next/server';

import { GameCore, GameCountryMetric, GameShort } from '@ts/games/game';
import { IgdbStudioCountry } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { gameCoreToShort } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { MAX_ENTRIES_IN_CHART } from '@lib/utils';

type GameWithCountries = GameCore & { countries: (number | undefined)[] };

const GAMES_IN_COUNTRIES = 3;
const GameSortKeys: (keyof GameShort)[] = ['hours', 'rating'];

const aggregateCountryData = (
  game: GameWithCountries,
  country?: number,
  stored?: GameCountryMetric
) => {
  if (!country) return undefined;

  const gameShort = gameCoreToShort(game);
  if (stored) stored.topGames.push(gameShort);

  return {
    country,
    count: (stored?.count ?? 0) + 1,
    hours: (stored?.hours ?? 0) + gameShort.hours,
    topGames: stored ? stored.topGames : [gameShort]
  };
};

const sortGamesTops = (countryData: GameCountryMetric) => {
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
};

const getGamesByCountries: GameEndpointAction<
  '/api/games/titles/countries'
> = async (_req, _params, games) => {
  const developersIds = new Set(games.flatMap((game) => game.developersIds))
    .values()
    .toArray();

  const developers = !developersIds
    ? []
    : await igdbRequest<IgdbStudioCountry>('/companies', {
        fields: ['country'],
        where: `id = (${developersIds.join(',')})`,
        limit: developersIds.length
      });

  const developersCountriesMap = new Map<number, number | undefined>(
    developers.map((developer) => [developer.id, developer.country])
  );

  const countriesGames: GameCountryMetric[] = games
    .mapByKey<GameWithCountries, 'apiId'>(
      (game) => ({
        ...game,
        countries: game.developersIds.map((developerId) =>
          developersCountriesMap.get(developerId)
        )
      }),
      'apiId'
    )
    .flatGroupBy<GameCountryMetric, 'country', number | undefined, 'countries'>(
      aggregateCountryData,
      'countries',
      'country',
      undefined
    )
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    })
    .slice(0, MAX_ENTRIES_IN_CHART)
    .toArray()
    .map(sortGamesTops);

  return NextResponse.json(countriesGames, {
    status: 200,
    statusText: 'Highest rated games were calculated by countries'
  });
};

export const GET = gameMetricEndpoint(getGamesByCountries);
