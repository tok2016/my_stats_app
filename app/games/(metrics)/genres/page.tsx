import { GameGenresMetricsIds } from '@lib/metrics/metrics-id';
import { getGames, getUserSet } from '@lib/server-actions';

import Metric from '../Metric';

export default async function GamesGenresPage() {
  const user = await getUserSet();
  const games = await getGames(user.id);

  return (
    <>
      {GameGenresMetricsIds.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} userId={user.id} />
      ))}
    </>
  );
}
