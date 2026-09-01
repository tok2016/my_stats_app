import countries from 'i18n-iso-countries';
import { Suspense } from 'react';

import { GameCountryMetric } from '@ts/games/game';
import { MetricContentProps, MetricId } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import GamesCountriesChart from '../charts/GamesCountriesChart';
import GamesCountriesSkeleton from '../skeletons/GamesCountriesSkeleton';
import { GameCountryChartData } from '../types';

type FetchGamesCountriesProps = {
  metricId: MetricId;
};

async function FetchGamesCountries({ metricId }: FetchGamesCountriesProps) {
  const countriesData = await getMetricData<GameCountryMetric[]>(
    '/api/games/titles/countries',
    []
  );

  const chartData: GameCountryChartData[] = countriesData.map((country, i) => ({
    id: country.country,
    name: countries.getName(country.country, 'en', { select: 'alias' }) ?? '',
    count: country.count,
    country: country.country,
    topGames: country.topGames,
    hours: country.hours,
    index: i
  }));

  return (
    <MetricWrapper id={metricId}>
      <GamesCountriesChart data={chartData} />
    </MetricWrapper>
  );
}

export default function GamesCountries({ metricId }: MetricContentProps) {
  return (
    <Suspense fallback={<GamesCountriesSkeleton />}>
      <FetchGamesCountries metricId={metricId} />
    </Suspense>
  );
}
