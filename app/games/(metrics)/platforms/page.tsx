import { PlatformsMetricsIds } from '@lib/metrics/metrics-id';
import { getCurrentUser, tryGetGames } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

/**
 * @returns Page with games platforms metrics.
 */
export default async function GamesPlatformsPage() {
  try {
    const user = await getCurrentUser();
    const gamesPage = await tryGetGames({ userId: user.id });

    return (
      <MetricPage
        games={gamesPage.games}
        userId={user.id}
        metrics={PlatformsMetricsIds.slice()}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
