import { GameTitlesMetricsIds } from '@lib/metrics/metrics-id';
import { getGames } from '@lib/server-actions';

import Metric from '../Metric';

export default async function GamesTitlesPage() {
  const games = await getGames();

  return (
    <>
      {GameTitlesMetricsIds.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} />
      ))}
    </>
  );
}
