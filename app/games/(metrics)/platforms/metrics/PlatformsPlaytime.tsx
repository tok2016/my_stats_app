'use client';

import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import PlatformsPlaytimeChart from '../charts/PlatformsPlaytimeChart';
import { PlatformPlaytimeChartData } from '../types';

type PlatformPlaytimeProps = {
  platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>;
  userId: string;
};

const fetchPlatformPlaytime =
  (platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>) =>
  async (params: {
    userId: string;
  }): Promise<MetricResponse<PlatformPlaytimeChartData[]>> => {
    const platformsPlaytimeData = await getMetricClient<PlaytimeData[]>(
      '/api/games/platforms/playtime',
      params
    );

    return {
      error: platformsPlaytimeData.error,
      data: platformsPlaytimeData.data?.map((platform, i) => ({
        id: platform.id,
        name: platforms.findByKey(platform.id)?.name ?? 'Other',
        index: i,
        percent: platform.percent,
        topGame: platform.topGame,
        count: platform.count,
        hours: platform.hours
      }))
    };
  };

export default function PlatformsPlaytime({
  platforms,
  userId
}: PlatformPlaytimeProps) {
  return (
    <MetricWrapper id='platforms-playtime' submetric>
      <FetchMetric
        fetchMetricData={fetchPlatformPlaytime(platforms)}
        metric={(data) => <PlatformsPlaytimeChart data={data} />}
        fallback={
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        }
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
