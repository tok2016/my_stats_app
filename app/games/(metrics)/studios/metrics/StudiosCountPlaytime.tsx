import { Suspense } from 'react';

import Game, { GameCore } from '@ts/games/game';
import { MetricId, PlaytimeData } from '@ts/games/metric';
import { StudioType } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import { StudiosGameFields } from '../../utils';
import StudiosCountChart from '../charts/StudiosCountChart';
import StudiosCountPlaytimeSkeleton from '../skeletons/StudiosCountSkeleton';
import { StudioCountData, StudiosMetricContentProps } from '../types';

type FetchStudiosCountPlaytimeProps = {
  metricId: MetricId;
  studios: ObjectMapArray<Game['developers'][number], 'id'>;
  type: StudioType;
};

const StudiosTypeFields: Record<StudioType, keyof GameCore> = {
  developer: 'developersIds',
  publisher: 'publishersIds'
};

async function FetchtudiosCountPlaytime({
  studios,
  type,
  metricId
}: FetchStudiosCountPlaytimeProps) {
  const searchParams = new URLSearchParams({ field: StudiosTypeFields[type] });
  const playtimeData = await getMetricData<PlaytimeData[]>(
    `/api/games/studios/count?${searchParams.toString()}`,
    []
  );

  const chartData: StudioCountData[] = playtimeData
    .filter((data) => data.id !== -1)
    .map((data, i) => ({
      id: data.id,
      name: studios.findByKey(data.id)?.name ?? 'Other',
      index: i,
      topGame: data.topGame,
      count: data.count,
      hours: data.hours,
      percent: data.percent
    }));

  return (
    <MetricWrapper id={metricId}>
      <StudiosCountChart data={chartData} type={type} />
    </MetricWrapper>
  );
}

export default async function StudiosCountPlaytime({
  metricId,
  games,
  type
}: StudiosMetricContentProps) {
  const studios = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game[StudiosGameFields[type]],
    'id'
  );

  return (
    <Suspense fallback={<StudiosCountPlaytimeSkeleton metricId={metricId} />}>
      <FetchtudiosCountPlaytime
        metricId={metricId}
        type={type}
        studios={studios}
      />
    </Suspense>
  );
}
