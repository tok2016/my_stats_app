import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import PlatformsPlaytimeChart from '../charts/PlatformsPlaytimeChart';
import { PlatformPlaytimeChartData } from '../types';

type PlatformPlaytimeProps = {
  platformsMap: Map<number | string, NonNullable<Game['platform']>>;
};

export default async function PlatformsPlaytime({
  platformsMap
}: PlatformPlaytimeProps) {
  const platforms = await getMetricData<PlaytimeData[]>(
    '/api/games/platforms/playtime',
    []
  );

  const chartData: PlatformPlaytimeChartData[] = platforms.map(
    (platform, i) => ({
      id: platform.id,
      name: platformsMap.get(platform.id)?.name ?? 'Other',
      index: i,
      percent: platform.percent,
      topGame: platform.topGame,
      count: platform.count,
      hours: platform.hours
    })
  );

  return <PlatformsPlaytimeChart data={chartData} />;
}
