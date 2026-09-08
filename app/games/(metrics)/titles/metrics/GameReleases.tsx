'use client';

import { MetricContentProps, YearCountMetric } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GamesLineChart from '../charts/GamesLineChart';
import { GameYearChartData } from '../types';

const fetchGameReleases = async (params: {
  userId: string;
}): Promise<MetricResponse<GameYearChartData[]>> => {
  const years = await getMetricClient<YearCountMetric[]>(
    '/api/games/titles/release',
    params
  );

  return {
    error: years.error,
    data: years.data?.map((year) => ({
      id: year.year,
      name: year.year.toString(),
      year: year.year,
      count: year.count,
      index: 0,
      topGame: year.topGames[0]?.name ?? 'no'
    }))
  };
};

export default function GameReleases({ metricId, userId }: MetricContentProps) {
  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchGameReleases}
        metric={(data) => (
          <GamesLineChart data={data} chartId='game-releases-line' />
        )}
        fallback={<ChartSkeleton type='line' />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
