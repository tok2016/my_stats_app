'use client';

import Game from '@ts/games/game';
import { CountData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import PlatformsCountChart from '../charts/PlatformsCountChart';
import { PlatformCountChartData } from '../types';

type PlatformsCountProps = {
  platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>;
  seriesArray: ObjectMapArray<NonNullable<Game['series']>, 'id'>;
  userId: string;
};

const fetchPlatformsCount =
  (
    platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>,
    series: ObjectMapArray<NonNullable<Game['series']>, 'id'>
  ) =>
  async (params: {
    userId: string;
  }): Promise<MetricResponse<PlatformCountChartData[]>> => {
    const platformsCountData = await getMetricClient<CountData[]>(
      '/api/games/platforms/count',
      params
    );

    return {
      error: platformsCountData.error,
      data: platformsCountData.data?.map((platform, i) => ({
        id: platform.id,
        percent: platform.percent,
        name: platforms.findByKey(platform.id)?.name ?? 'Other',
        index: i,
        count: platform.count,
        topSeries: platform.topSeries
          ? series.findByKey(platform.topSeries)
          : undefined
      }))
    };
  };

export default function PlatformsCount({
  platforms,
  seriesArray,
  userId
}: PlatformsCountProps) {
  return (
    <MetricWrapper id='platforms-count' submetric>
      <FetchMetric
        fetchMetricData={fetchPlatformsCount(platforms, seriesArray)}
        metric={(data) => <PlatformsCountChart data={data} />}
        fallback={
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        }
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
