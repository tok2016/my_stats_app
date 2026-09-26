import countries from 'i18n-iso-countries';

import { NextResponse } from 'next/server';

import { GameCore, GameCountryMetric } from '@ts/games/game';
import { IgdbStudioCountry } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { gameCoreToShort } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { MAX_ENTRIES_IN_CHART, generateErrorResponse } from '@lib/utils';

type GameWithCountries = GameCore & { countries: (number | undefined)[] };

const GAMES_IN_COUNTRIES = 3;

/**
 *
 * @param game - Game data.
 * @param country - Country code from countries array of game.
 * @param stored - Previously stored country group.
 * @returns Country group with aggregated data.
 */
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
    name: countries.getName(country, 'en', { select: 'alias' }) ?? '',
    count: (stored?.count ?? 0) + 1,
    hours: (stored?.hours ?? 0) + gameShort.hours,
    topGames: stored ? stored.topGames : [gameShort]
  };
};

/**
 * Return country data with games sorted by rating and playtime.
 * @param countryData - Country data with games.
 * @returns Country data with sorted top games.
 */
const sortGamesTops = (countryData: GameCountryMetric) => {
  const ratingTops = countryData.topGames
    .sort((a, b) => {
      const diff = (b.rating ?? 0) - (a.rating ?? 0);
      if (!diff) return b.hours - a.hours;
      return diff;
    })
    .slice(0, GAMES_IN_COUNTRIES);

  const sortedCountyData: GameCountryMetric = {
    ...countryData,
    topGames: ratingTops
  };

  return sortedCountyData;
};

/**
 * Public method. Calculates top countries by their developers' games count and playtime.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found, no game or studio of theirs is found.
 * @returns Top countires by games count and playtime with highest rated or longest played games.
 */
const getGamesByCountries: GameEndpointAction<
  '/api/games/titles/countries'
> = async (_req, _params, games) => {
  //Fetches countries data of every developer from IGDB.
  const developersIds = new Set(games.flatMap((game) => game.developersIds))
    .values()
    .toArray();

  if (!developersIds.length)
    throw generateErrorResponse(404, 'No studios was found');

  const developers = await igdbRequest<IgdbStudioCountry>('/companies', {
    fields: ['country'],
    where: `id = (${developersIds.join(',')})`,
    limit: developersIds.length
  });

  //Developer-country map.
  const developersCountriesMap = new Map<number, number | undefined>(
    developers.map((developer) => [developer.id, developer.country])
  );

  //Adds countries to games.
  const gamesWithCountries = games.mapByKey<GameWithCountries, 'apiId'>(
    (game) => ({
      ...game,
      countries: game.developersIds.map((developerId) =>
        developersCountriesMap.get(developerId)
      )
    }),
    'apiId'
  );

  //Aggregates games by country. Sorts countries by games count and playtime.
  const countriesGames: GameCountryMetric[] = gamesWithCountries
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
