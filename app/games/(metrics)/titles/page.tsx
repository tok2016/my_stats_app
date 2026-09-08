import { GameTitlesMetricsIds } from '@lib/metrics/metrics-id';
import { getCurrentUser, getGames } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

export default async function GamesTitlesPage() {
  try {
    const user = await getCurrentUser();
    const gamesPage = await getGames({ userId: user.id });

    return (
      <MetricPage
        metrics={GameTitlesMetricsIds.slice()}
        games={gamesPage.games}
        userId={user.id}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
