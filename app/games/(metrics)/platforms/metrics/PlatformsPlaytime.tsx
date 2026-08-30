import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import PlatformsPlaytimeChart from '../charts/PlatformsPlaytimeChart';
import { PlatformPlaytimeChartData } from '../types';

type PlatformPlaytimeProps = {
  platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>;
};

export default async function PlatformsPlaytime({
  platforms
}: PlatformPlaytimeProps) {
  const platformsPlaytimeData = await getMetricData<PlaytimeData[]>(
    '/api/games/platforms/playtime',
    []
  );

  const chartData: PlatformPlaytimeChartData[] = platformsPlaytimeData.map(
    (platform, i) => ({
      id: platform.id,
      name: platforms.findByKey(platform.id)?.name ?? 'Other',
      index: i,
      percent: platform.percent,
      topGame: platform.topGame,
      count: platform.count,
      hours: platform.hours
    })
  );

  return <PlatformsPlaytimeChart data={chartData} />;
}
