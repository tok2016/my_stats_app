import { GameGenresMetricsIds } from '@lib/metrics/metrics-id';
import { getCurrentUser, tryGetGames } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

export default async function GamesGenresPage() {
  try {
    const user = await getCurrentUser();
    const gamesPage = await tryGetGames({ userId: user.id });

    return (
      <MetricPage
        games={gamesPage.games}
        metrics={GameGenresMetricsIds.slice()}
        userId={user.id}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
