import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { CountCompareData } from '@ts/games/metric';
import { IgdbStudioCountry, StudioCountryMetric } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';
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
  studioId: number,
  studioCompareData: CountCompareData,
  countriesMetricMap: Map<number, StudioCountryMetric>,
  country?: number
) => {
  if (!country || !studioCompareData) return;

  const countryData = countriesMetricMap.get(country);
  if (!countryData)
    countriesMetricMap.set(country, {
      country: country,
      gamesCount: studioCompareData.count,
      developers: [studioId]
    });
  else if (countryData.developers.length < TOP_ENTRIES) {
    countryData.gamesCount += studioCompareData.count;
    countryData.developers.push(studioId);
  }
};

const getStudiosByCountry = async (games: GameCore[]) => {
  const studiosCompareMap = new Map<number, CountCompareData>();

  games.forEach((game) => {
    game.developersIds.forEach((studioId) => {
      const studioData = studiosCompareMap.get(studioId);
      studiosCompareMap.set(studioId, {
        count: (studioData?.count ?? 0) + 1,
        minutes: (studioData?.minutes ?? 0) + game.minutes
      });
    });
  });

  const studioCountryMap = await getCountriesOfStudios(
    studiosCompareMap.keys().toArray()
  );
  const countriesMetricMap = new Map<number, StudioCountryMetric>();

  studiosCompareMap
    .entries()
    .toArray()
    .sort((a, b) => {
      const countDiff = b[1].count - a[1].count;
      if (!countDiff) return b[1].minutes - a[1].minutes;
      return countDiff;
    })
    .forEach((studio) => {
      setCountryData(
        studio[0],
        studio[1],
        countriesMetricMap,
        studioCountryMap.get(studio[0])
      );
    });

  const countries = countriesMetricMap
    .values()
    .toArray()
    .sort((a, b) => {
      const countDiff = b.gamesCount - a.gamesCount;
      if (!countDiff) return b.developers.length - a.developers.length;
      return countDiff;
    })
    .slice(0, MAX_ENTRIES_IN_CHART);

  return NextResponse.json(countries, {
    status: 200,
    statusText: 'Studios were calculated by countries'
  });
};

export const GET = gameEndpoint(getStudiosByCountry);
