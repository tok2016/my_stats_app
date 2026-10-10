'use client';

import { MetricCoreProps, YearCountMetric } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GamesYearLineChart from '../charts/GamesYearLineChart';
import { GameYearChartData } from '../types';

/**
 * @param params - Search params with user id.
 * @returns Games play dates years with games count and top game or error data.
 */
const fetchGamePlayDates = async (params: {
  userId: string;
}): Promise<MetricResponse<GameYearChartData[]>> => {
  const years = await getMetricClient<YearCountMetric[]>(
    '/api/games/titles/playdate',
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
 * @returns Metric of games play dates years with games count and top game.
 */
export default function GamePlayDates({ userId }: MetricCoreProps) {
  return (
    <MetricWrapper id='games-playdate'>
      <FetchMetric
        fetchMetricData={fetchGamePlayDates}
        metric={(data) => (
          <GamesYearLineChart data={data} chartId='game-playdates-line' />
        )}
        fallback={<ChartSkeleton type='line' />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
