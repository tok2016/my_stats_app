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
import { StudiosGameCoreFields, StudiosGameFields } from '../../utils';
import StudiosCountChart from '../charts/StudiosCountChart';
import {
  FetchStudiosParams,
  StudioCountData,
  StudiosMetricContentProps
} from '../types';

const fetchStudiosCountPlaytime =
  (studios: ObjectMapArray<Game['developers'][number], 'id'>) =>
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

export default function StudiosCountPlaytime({
  metricId,
  games,
  type,
  userId
}: StudiosMetricContentProps) {
  const studios = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game[StudiosGameFields[type]],
    'id'
  );

  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchStudiosCountPlaytime(studios)}
        metric={(data) => <StudiosCountChart type={type} data={data} />}
        fallback={<StudiosCountPlaytimeSkeleton />}
        params={{ userId, field: StudiosGameCoreFields[type] }}
      />
    </MetricWrapper>
  );
}
