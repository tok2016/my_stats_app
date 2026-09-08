'use client';

import { GameCountryMetric } from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GamesCountriesChart from '../charts/GamesCountriesChart';
import { GameCountryChartData } from '../types';

const fetchGamesCountries = async (params: {
  userId: string;
}): Promise<MetricResponse<GameCountryChartData[]>> => {
  const countriesData = await getMetricClient<GameCountryMetric[]>(
    '/api/games/titles/countries',
    params
  );

  return {
    error: countriesData.error,
    data: countriesData.data?.map((country, i) => ({
      id: country.country,
      name: country.name,
      count: country.count,
      country: country.country,
      topGames: country.topGames,
      hours: country.hours,
      index: i
    }))
  };
};

export default function GamesCountries({
  metricId,
  userId
}: MetricContentProps) {
  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchGamesCountries}
        metric={(data) => <GamesCountriesChart data={data} />}
        fallback={<ChartSkeleton type='map' />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
