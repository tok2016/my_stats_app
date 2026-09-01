import { PlatformsMetricsIds } from '@lib/metrics/metrics-id';
import { getGames } from '@lib/server-actions';

import Metric from '../Metric';

export default async function GamesPlatformsPage() {
  const games = await getGames();
  return (
    <>
      {PlatformsMetricsIds.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} />
      ))}
    </>
  );
}
