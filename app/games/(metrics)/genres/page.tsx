import { GameGenresMetricsIds } from '@lib/metrics/metrics-id';
import { getGames } from '@lib/server-actions';

import Metric from '../FetchMetric';

export default async function GamesGenresPage() {
  const games = await getGames();

  return (
    <>
      {GameGenresMetricsIds.forEach((metricId) => (
        <Metric id={metricId} games={games} key={metricId} />
      ))}
    </>
  );
}
