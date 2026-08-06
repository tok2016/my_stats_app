import Game from '@ts/games/game';
import { CountData } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import PlatformsCountChart from '../charts/PlatformsCountChart';
import { PlatformCountChartData } from '../types';

type PlatformsCountProps = {
  platformsMap: Map<number | string, NonNullable<Game['platform']>>;
  seriesMap: Map<number | string, NonNullable<Game['series']>>;
};

export default async function PlatformsCount({
  platformsMap,
  seriesMap
}: PlatformsCountProps) {
  const platforms = await getMetricData<CountData[]>(
    '/api/games/platforms/count',
    []
  );

  const chartData: PlatformCountChartData[] = platforms.map((platform, i) => ({
    id: platform.id,
    percent: platform.percent,
    name: platformsMap.get(platform.id)?.name ?? 'Other',
    index: i,
    count: platform.count,
    topSeries: platform.topSeries
      ? seriesMap.get(platform.topSeries)
      : undefined
  }));

  return <PlatformsCountChart data={chartData} />;
}
