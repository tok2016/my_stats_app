import { StudiosMetricsIds } from '@lib/metrics/metrics-id';
import { getGames } from '@lib/server-actions';

import Metric from '../Metric';

export default async function GamesStudiosPage() {
  const games = await getGames();

  return (
    <>
      {StudiosMetricsIds.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} />
      ))}
    </>
  );
}
