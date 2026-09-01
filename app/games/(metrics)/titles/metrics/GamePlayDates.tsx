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

type FetchGamePlayDatesProps = { metricId: MetricId };

async function FetchGamePlayDates({ metricId }: FetchGamePlayDatesProps) {
  const years = await getMetricData<YearCountMetric[]>(
    '/api/games/titles/playdate',
    []
  );

  const chartData: GameYearChartData[] = years.map((year) => ({
    id: year.year,
    name: year.year.toString(),
    year: year.year,
    count: year.count,
    index: 0,
    topGame: year.topGames[0].name
  }));

  return (
    <MetricWrapper id={metricId}>
      <GamesLineChart data={chartData} chartId='game-playdates-line' />
    </MetricWrapper>
  );
}

export default function GamePlayDates({ metricId }: MetricContentProps) {
  return (
    <Suspense fallback={<GameYearsSkeleton metricId={metricId} />}>
      <FetchGamePlayDates metricId={metricId} />
    </Suspense>
  );
}
