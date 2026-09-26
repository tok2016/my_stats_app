import countries from 'i18n-iso-countries';

import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { CountCompareData } from '@ts/games/metric';
import { IgdbStudioCountry, StudioCountryMetric } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';
import { MAX_ENTRIES_IN_CHART, TOP_ENTRIES } from '@lib/utils';

type CountyStudioCountCompare = CountCompareData & { country?: number };

/**
 * Returns studios compare data with countries.
 * @param studiosCompareData - Studios with games count and playtime
 * @returns Studios compare data with country data.
 */
const getCountriesOfStudios = async (
  studiosCompareData: ObjectMapArray<CountCompareData, 'id'>
) => {
  //Ids of developers.
  const ids = studiosCompareData
    .toArray()
    .map((data) => data.id)
    .join(',');

  const studiosCompareWithCountries = new ObjectMapArray<
    CountyStudioCountCompare,
    'id'
  >([], 'id');

  if (!ids) return studiosCompareWithCountries;

  //Fetches countries of given developers.
  const studiosWithCountry = await igdbRequest<IgdbStudioCountry>(
    '/companies',
    {
      fields: ['country'],
      where: `id = (${ids})`,
      limit: studiosCompareData.count
    }
  );

  //Adds country data to studio compare data.
  studiosWithCountry.forEach((studioCountry) => {
    const studioCompare = studiosCompareData.findByKey(studioCountry.id);
    if (studioCompare)
      studiosCompareWithCountries.push({
        ...studioCompare,
        country: studioCountry.country
      });
  });

  return studiosCompareWithCountries;
};

/**
 * Calculates compate data for developers groups.
 * @param game - Base game data.
 * @param developerId - Developer id from developers array of game.
 * @param stored - Previously stored developer group.
 * @returns Developer group with aggregated data.
 */
const aggregateStudioCompare = (
  game: GameCore,
  developerId: number,
  stored?: CountCompareData
) => ({
  id: developerId,
  count: (stored?.count ?? 0) + 1,
  hours: (stored?.hours ?? 0) + game.hours
});

/**
 * Calculates aggregated country data.
 * @param studioCompareData - Aggregated studio data.
 * @param country - Country of studio.
 * @param stored - Previously stored country group.
 * @returns Country group with aggregated data.
 */
const aggregateCountryData = (
  studioCompareData: CountCompareData,
  country?: number,
  stored?: StudioCountryMetric
) => {
  if (!country) return undefined;
  if (stored && stored.developers.length < TOP_ENTRIES)
    stored.developers.push(studioCompareData.id);

  return {
    country,
    name: countries.getName(country, 'en', { select: 'alias' }) ?? '',
    gamesCount: (stored?.gamesCount ?? 0) + studioCompareData.count,
    developers: stored ? stored.developers : [studioCompareData.id]
  };
};

/**
 * Public method. Calculates top countries by their developers' games count and playtime.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top countires by games count and playtime with top developers.
 */
const getStudiosByCountry: GameEndpointAction<
  '/api/games/studios/countries'
> = async (_req, _params, games) => {
  //Aggragate games by developer id with count and playtime.
  const studiosCompareData = games.flatGroupBy(
    aggregateStudioCompare,
    'developersIds',
    'id',
    undefined
  );

  //Fetches countries of developers and sorts developers by count and playtime.
  const studiosWithCountries = await getCountriesOfStudios(studiosCompareData);
  studiosWithCountries.sort((a, b) => {
    const diff = b.count - a.count;
    if (!diff) return b.hours - a.hours;
    return diff;
  });

  //Aggregates studios by countries with games count and top developers.
  //Sorts countries by games and developers count.
  const countries = studiosWithCountries
    .groupBy(aggregateCountryData, 'country', 'country', undefined)
    .sort((a, b) => {
      const countDiff = b.gamesCount - a.gamesCount;
      if (!countDiff) return b.developers.length - a.developers.length;
      return countDiff;
    })
    .slice(0, MAX_ENTRIES_IN_CHART)
    .toArray();

  return NextResponse.json(countries, {
    status: 200,
    statusText: 'Studios were calculated by countries'
  });
};

export const GET = gameMetricEndpoint(getStudiosByCountry);
