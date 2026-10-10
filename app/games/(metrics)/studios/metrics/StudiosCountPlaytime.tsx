'use client';

import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import Skeleton from '@components/Skeleton';
import AdjacentChart from '@components/charts/AdjacentChart';
import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import { StudiosGameCoreFields } from '../../utils';
import StudiosCountChart from '../charts/StudiosCountChart';
import {
  FetchStudiosParams,
  StudioCountData,
  StudiosMetricContentProps
} from '../types';

/**
 * @param studios - All studios (developers or publishers) of user's games.
 * @returns Funtion to fetch top studios of given type by games count and playtime with top game.
 */
const fetchStudiosCountPlaytime =
  (studios: ObjectMapArray<Game['developers'][number], 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top studios of given type by games count or error data.
   */
  async (
    params: FetchStudiosParams
  ): Promise<MetricResponse<StudioCountData[]>> => {
    const playtimeData = await getMetricClient<PlaytimeData[]>(
      '/api/games/studios/count',
      params
    );

    return {
      error: playtimeData.error,
      data: playtimeData.data
        ?.filter((data) => data.id !== -1)
        .map((data, i) => ({
          id: data.id,
          name: studios.findByKey(data.id)?.name ?? 'Other',
          index: i,
          topGame: data.topGame,
          count: data.count,
          hours: data.hours,
          percent: data.percent
        }))
    };
  };

export function StudiosCountPlaytimeSkeleton() {
  return (
    <AdjacentChart>
      <Skeleton type='tablet' rows={10} />
      <ChartSkeleton type='bar' />
    </AdjacentChart>
  );
}

/**
 * @param props
 * @param props.studios - All studios of user's games.
 * @param props.userId - User whose metrics will be fetched.
 * @param props.type - Studio type: developer or publisher.
 * @returns Metric of top studios of given type by games count and playtime.
 */
export default function StudiosCountPlaytime({
  studios,
  type,
  userId
}: StudiosMetricContentProps) {
  return (
    <MetricWrapper
      id={type === 'developer' ? 'developers-playtime' : 'publishers-playtime'}
    >
      <FetchMetric
        fetchMetricData={fetchStudiosCountPlaytime(studios)}
        metric={(data) => <StudiosCountChart type={type} data={data} />}
        fallback={<StudiosCountPlaytimeSkeleton />}
        params={{ userId, field: StudiosGameCoreFields[type] }}
      />
    </MetricWrapper>
  );
}
