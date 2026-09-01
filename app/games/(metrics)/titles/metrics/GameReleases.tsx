import { Suspense } from 'react';

import {
  MetricContentProps,
  MetricId,
  YearCountMetric
} from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import GamesLineChart from '../charts/GamesLineChart';
import GameYearsSkeleton from '../skeletons/GameYearsSkeleton';
import { GameYearChartData } from '../types';

type FetchGameReleasesProps = {
  metricId: MetricId;
  userId: string;
};

async function FetchGameReleases({ metricId, userId }: FetchGameReleasesProps) {
  const years = await getMetricData<YearCountMetric[]>(
    '/api/games/titles/release',
    [],
    userId
  );

  const chartData: GameYearChartData[] = years.map((year) => ({
    id: year.year,
    name: year.year.toString(),
    year: year.year,
    count: year.count,
    index: 0,
    topGame: year.topGames[0]?.name ?? 'no'
  }));

  return (
    <MetricWrapper id={metricId}>
      <GamesLineChart data={chartData} chartId='games-releases-line' />
    </MetricWrapper>
  );
}

export default function GameReleases({ metricId, userId }: MetricContentProps) {
  return (
    <Suspense fallback={<GameYearsSkeleton metricId={metricId} />}>
      <FetchGameReleases metricId={metricId} userId={userId} />
    </Suspense>
  );
}
