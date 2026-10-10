import { GameTitlesMetricsIds } from '@lib/metrics/metrics-id';
import { tryGetCurrentUser, tryGetGameItemsData } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

/**
 * @returns Page with games titles metrics.
 */
export default async function GamesTitlesPage() {
  try {
    const user = await tryGetCurrentUser();
    const itemsData = await tryGetGameItemsData(user.id);

    return (
      <MetricPage
        metrics={GameTitlesMetricsIds.slice()}
        userId={user.id}
        itemsData={itemsData}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
