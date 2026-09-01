import { GameTitlesMetricsIds } from '@lib/metrics/metrics-id';
import { getGames, getUserSet } from '@lib/server-actions';

import Metric from '../Metric';

export default async function GamesTitlesPage() {
  const user = await getUserSet();
  const games = await getGames(user.id);

  return (
    <>
      {GameTitlesMetricsIds.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} userId={user.id} />
      ))}
    </>
  );
}
