'use client';

import { CoreMetricProps, YearCountMetric } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GamesYearLineChart from '../charts/GamesYearLineChart';
import { GameYearChartData } from '../types';

/**
 * @param params - Search params with user id.
 * @returns Games release years with games count and top game or error data.
 */
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

/**
 * @param props
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric of games release years with games count and top game.
 */
export default function GameReleases({ userId }: CoreMetricProps) {
  return (
    <MetricWrapper id='games-release'>
      <FetchMetric
        fetchMetricData={fetchGameReleases}
        metric={(data) => (
          <GamesYearLineChart data={data} chartId='game-releases-line' />
        )}
        fallback={<ChartSkeleton type='line' />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
