'use client';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';
import { StudioCountryMetric } from '@ts/games/studio';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import StudiosMapChart from '../charts/StuidosMapChart';
import { CountryStudioChartData } from '../types';

const fetchStudiosCountries =
  (developers: ObjectMapArray<Game['developers'][number], 'id'>) =>
  async (params: {
    userId: string;
  }): Promise<MetricResponse<CountryStudioChartData[]>> => {
    const countriesData = await getMetricClient<StudioCountryMetric[]>(
      '/api/games/studios/countries',
      params
    );

    return {
      error: countriesData.error,
      data: countriesData.data?.map((country, i) => ({
        id: country.country,
        name: country.name,
        index: i,
        count: country.gamesCount,
        developers: country.developers.map(
          (developer) => developers.findByKey(developer)?.name ?? ''
        )
      }))
    };
  };

export default function StudiosCountries({
  games,
  metricId,
  userId
}: MetricContentProps) {
  const developers = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game.developers,
    'id'
  );

  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchStudiosCountries(developers)}
        metric={(data) => <StudiosMapChart data={data} />}
        fallback={<ChartSkeleton type='map' />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
