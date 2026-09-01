import { StudiosMetricsIds } from '@lib/metrics/metrics-id';
import { getGames, getUserSet } from '@lib/server-actions';

import Metric from '../Metric';

export default async function GamesStudiosPage() {
  const user = await getUserSet();
  const games = await getGames(user.id);

  return (
    <>
      {StudiosMetricsIds.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} userId={user.id} />
      ))}
    </>
  );
}
