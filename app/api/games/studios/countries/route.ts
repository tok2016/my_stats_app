import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { CountCompareData } from '@ts/games/metric';
import { IgdbStudioCountry, StudioCountryMetric } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';
import { MAX_ENTRIES_IN_CHART, TOP_ENTRIES } from '@lib/utils';

const getCountriesOfStudios = async (studiosIds: number[]) => {
  const studiosWithCountry = await igdbRequest<IgdbStudioCountry>(
    '/companies',
    {
      fields: ['country'],
      where: `id = (${studiosIds.join(',')})`,
      limit: studiosIds.length
    }
  );

  const studioCountryMap = new Map<number, number>();
  studiosWithCountry.forEach((studioCountry) => {
    if (studioCountry.country)
      studioCountryMap.set(studioCountry.id, studioCountry.country);
  });

  return studioCountryMap;
};

const setCountryData = (
  studioCompareData: CountCompareData,
  countriesMetricMap: ObjectMapArray<StudioCountryMetric, 'country'>,
  country?: number
) => {
  if (!country || !studioCompareData) return;

  const countryData = countriesMetricMap.findByKey(country);
  if (!countryData)
    countriesMetricMap.push({
      country: country,
      gamesCount: studioCompareData.count,
      developers: [studioCompareData.id]
    });
  else if (countryData.developers.length < TOP_ENTRIES) {
    countryData.gamesCount += studioCompareData.count;
    countryData.developers.push(studioCompareData.id);
  }
};

const getStudiosByCountry = async (games: GameCore[]) => {
  const studiosCompareData = new ObjectMapArray<CountCompareData, 'id'>(
    [],
    'id'
  );

  games.forEach((game) => {
    game.developersIds.forEach((studioId) => {
      const studioData = studiosCompareData.findByKey(studioId);
      studiosCompareData.push({
        id: studioId,
        count: (studioData?.count ?? 0) + 1,
        hours: (studioData?.hours ?? 0) + game.hours
      });
    });
  });

  const studioCountryMap = await getCountriesOfStudios(
    studiosCompareData.map((compareData) => compareData.id).toArray()
  );

  const countriesMetricData = new ObjectMapArray<
    StudioCountryMetric,
    'country'
  >([], 'country');

  studiosCompareData.forEach((studio) => {
    setCountryData(
      studio,
      countriesMetricData,
      studioCountryMap.get(studio.id)
    );
  });

  const countries = countriesMetricData
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

export const GET = gameEndpoint(getStudiosByCountry);
