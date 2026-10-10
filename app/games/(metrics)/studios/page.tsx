import { StudiosMetricsIds } from '@lib/metrics/metrics-id';
import { tryGetCurrentUser, tryGetGameItemsData } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

/**
 * @returns Page with games studios metrics.
 */
export default async function GamesStudiosPage() {
  try {
    const user = await tryGetCurrentUser();
    const itemsData = await tryGetGameItemsData(user.id);

    return (
      <MetricPage
        metrics={StudiosMetricsIds.slice()}
        itemsData={itemsData}
        userId={user.id}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
