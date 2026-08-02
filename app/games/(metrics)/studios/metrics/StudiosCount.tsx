import Game, { GameCore } from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';
import { StudioType } from '@ts/games/studio';

import { getMetricData } from '@lib/server-actions';

import StudiosCountChart from '../charts/StudiosCountChart';
import { StudioCountData } from '../types';

type StudiosCountProps = {
  studiosMap: Map<number | string, Game['developers'][number]>;
  type: StudioType;
};

const StudiosTypeFields: Record<StudioType, keyof GameCore> = {
  developer: 'developersIds',
  publisher: 'publishersIds'
};

export default async function StudiosCount({
  studiosMap,
  type
}: StudiosCountProps) {
  const searchParams = new URLSearchParams({ field: StudiosTypeFields[type] });
  const playtimeData = await getMetricData<PlaytimeData[]>(
    `/api/games/studios/count?${searchParams.toString()}`,
    []
  );

  const chartData: StudioCountData[] = playtimeData
    .filter((data) => data.id !== -1)
    .map((data, i) => ({
      id: data.id,
      name: studiosMap.get(data.id)?.name ?? 'Other',
      index: i,
      topGame: data.topGame,
      count: data.count,
      hours: data.hours,
      percent: data.percent
    }));

  return <StudiosCountChart data={chartData} type={type} />;
}
