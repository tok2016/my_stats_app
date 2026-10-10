import { GameGenresMetricsIds } from '@lib/metrics/metrics-id';
import { tryGetCurrentUser, tryGetGameItemsData } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

/**
 * @returns Page with games genres metrics.
 */
export default async function GamesGenresPage() {
  try {
    const user = await tryGetCurrentUser();
    const itemsData = await tryGetGameItemsData(user.id);

    return (
      <MetricPage
        metrics={GameGenresMetricsIds.slice()}
        userId={user.id}
        itemsData={itemsData}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
