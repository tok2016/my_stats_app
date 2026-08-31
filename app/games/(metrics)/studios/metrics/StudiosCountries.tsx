import countries from 'i18n-iso-countries';
import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricContentProps, MetricId } from '@ts/games/metric';
import { StudioCountryMetric } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import StudiosMapChart from '../charts/StuidosMapChart';
import StudiosCountriesSkeleton from '../skeletons/StudiosCountriesSkeleton';
import { CountryStudioChartData } from '../types';

type FetchStudiosCountries = {
  developers: ObjectMapArray<Game['developers'][number], 'id'>;
  metricId: MetricId;
};

async function FetchStudiosCountries({
  metricId,
  developers
}: FetchStudiosCountries) {
  const countriesData = await getMetricData<StudioCountryMetric[]>(
    '/api/games/studios/countries',
    []
  );

  const countriesChartData: CountryStudioChartData[] = countriesData
    .map((country, i) => ({
      id: country.country,
      name: countries.getName(country.country, 'en', { select: 'alias' }) ?? '',
      index: i,
      count: country.gamesCount,
      developers: country.developers.map(
        (developer) => developers.findByKey(developer)?.name ?? ''
      )
    }))
    .filter((country) => !!country.name);

  return (
    <MetricWrapper id={metricId}>
      <StudiosMapChart data={countriesChartData} />
    </MetricWrapper>
  );
}

export default async function StudiosCountries({
  games,
  metricId
}: MetricContentProps) {
  const developers = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game.developers,
    'id'
  );

  return (
    <Suspense fallback={<StudiosCountriesSkeleton />}>
      <FetchStudiosCountries developers={developers} metricId={metricId} />
    </Suspense>
  );
}
