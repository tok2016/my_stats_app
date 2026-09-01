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

const getCountriesOfStudios = async (
  studiosCompareData: ObjectMapArray<CountCompareData, 'id'>
) => {
  const ids = studiosCompareData
    .toArray()
    .map((data) => data.id)
    .join(',');

  const studiosCompareWithCountries = new ObjectMapArray<
    CountyStudioCountCompare,
    'id'
  >([], 'id');

  if (!ids) return studiosCompareWithCountries;

  const studiosWithCountry = await igdbRequest<IgdbStudioCountry>(
    '/companies',
    {
      fields: ['country'],
      where: `id = (${ids})`,
      limit: studiosCompareData.count
    }
  );

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

const aggregateStudioCompare = (
  game: GameCore,
  developerId: number,
  stored?: CountCompareData
) => ({
  id: developerId,
  count: (stored?.count ?? 0) + 1,
  hours: (stored?.hours ?? 0) + game.hours
});

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
    gamesCount: (stored?.gamesCount ?? 0) + studioCompareData.count,
    developers: stored ? stored.developers : [studioCompareData.id]
  };
};

const getStudiosByCountry: GameEndpointAction<
  '/api/games/studios/countries'
> = async (_req, _params, games) => {
  const studiosCompareData = games.flatGroupBy(
    aggregateStudioCompare,
    'developersIds',
    'id',
    undefined
  );

  const studiosWithCountries = await getCountriesOfStudios(studiosCompareData);
  studiosWithCountries.sort((a, b) => {
    const diff = b.count - a.count;
    if (!diff) return b.hours - a.hours;
    return diff;
  });

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
