import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { CountCompareData } from '@ts/games/metric';
import { IgdbStudioCountry, StudioCountryMetric } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/igdb';

const getStudiosStudios = async (studiosIds: number[]) => {
  const studiosCountries = await igdbRequest<IgdbStudioCountry>('/companies', {
    fields: ['country'],
    where: `id = (${studiosIds.join(',')})`
  });

  const studiosCountriesMap = new Map<number, number>();
  studiosCountries.forEach((studioCountry) => {
    if (studioCountry.country)
      studiosCountriesMap.set(studioCountry.id, studioCountry.country);
  });

  return studiosCountriesMap;
};

const setCountryData = (
  studioId: number,
  studiosCountMap: Map<number, CountCompareData>,
  countriesMap: Map<number, StudioCountryMetric>,
  field: keyof Omit<StudioCountryMetric, 'country'>,
  studioCountry?: number
) => {
  const studioGamesCount = studiosCountMap.get(studioId);
  if (!studioCountry || !studioGamesCount) return;

  const countryData = countriesMap.get(studioCountry);
  if (!countryData)
    countriesMap.set(studioCountry, {
      country: studioCountry,
      [field]: { ...studioGamesCount, id: studioId }
    });
  else {
    const previousStudio =
      studiosCountMap.get(countryData[field]?.id ?? 0) ?? studioGamesCount;

    countryData[field] =
      studioGamesCount.count > previousStudio.count
      || (studioGamesCount.count === previousStudio.count
        && studioGamesCount.minutes >= previousStudio.minutes)
        ? { id: studioId, ...studioGamesCount }
        : countryData[field];
  }
};

const getStudiosCountries = async (games: GameCore[]) => {
  const studiosMap = new Map<number, CountCompareData>();

  games.forEach((game) => {
    const gameStudios = [...game.developersIds, ...game.publishersIds];
    gameStudios.forEach((studioId) => {
      const studioData = studiosMap.get(studioId);
      studiosMap.set(studioId, {
        count: (studioData?.count ?? 0) + 1,
        minutes: (studioData?.minutes ?? 0) + game.minutes
      });
    });
  });

  const studiosCountries = await getStudiosStudios(studiosMap.keys().toArray());
  const countriesMap = new Map<number, StudioCountryMetric>();

  games.forEach((game) => {
    game.developersIds.forEach((developerId) =>
      setCountryData(
        developerId,
        studiosMap,
        countriesMap,
        'developer',
        studiosCountries.get(developerId)
      )
    );

    game.publishersIds.forEach((publisherId) => {
      setCountryData(
        publisherId,
        studiosMap,
        countriesMap,
        'publisher',
        studiosCountries.get(publisherId)
      );
    });
  });

  const countries = countriesMap
    .values()
    .toArray()
    .sort((a, b) => {
      const developersDiff =
        (b.developer?.count ?? 0) - (a.developer?.count ?? 0);
      if (!developersDiff)
        return (b.publisher?.count ?? 0) - (a.publisher?.count ?? 0);
      return developersDiff;
    });

  return NextResponse.json(countries, {
    status: 200,
    statusText: 'Studios were calculated by countries'
  });
};

export const GET = gameEndpoint(getStudiosCountries);
