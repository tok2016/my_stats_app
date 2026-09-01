import Game from '@ts/games/game';
import { CountData } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import PlatformsCountChart from '../charts/PlatformsCountChart';
import { PlatformCountChartData } from '../types';

type PlatformsCountProps = {
  platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>;
  seriesArray: ObjectMapArray<NonNullable<Game['series']>, 'id'>;
  userId: string;
};

export default async function PlatformsCount({
  platforms,
  seriesArray,
  userId
}: PlatformsCountProps) {
  const platformsCountData = await getMetricData<CountData[]>(
    '/api/games/platforms/count',
    [],
    userId
  );

  const chartData: PlatformCountChartData[] = platformsCountData.map(
    (platform, i) => ({
      id: platform.id,
      percent: platform.percent,
      name: platforms.findByKey(platform.id)?.name ?? 'Other',
      index: i,
      count: platform.count,
      topSeries: platform.topSeries
        ? seriesArray.findByKey(platform.topSeries)
        : undefined
    })
  );

  return <PlatformsCountChart data={chartData} />;
}
