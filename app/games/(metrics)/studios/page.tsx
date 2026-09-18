import { StudiosMetricsIds } from '@lib/metrics/metrics-id';
import { getCurrentUser, tryGetGames } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

export default async function GamesStudiosPage() {
  try {
    const user = await getCurrentUser();
    const gamesPage = await tryGetGames({ userId: user.id });

    return (
      <MetricPage
        metrics={StudiosMetricsIds.slice()}
        games={gamesPage.games}
        userId={user.id}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
