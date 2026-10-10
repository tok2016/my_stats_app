import { PlatformsMetricsIds } from '@lib/metrics/metrics-id';
import { tryGetCurrentUser, tryGetGameItemsData } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '../components/MetricPage';

/**
 * @returns Page with games platforms metrics.
 */
export default async function GamesPlatformsPage() {
  try {
    const user = await tryGetCurrentUser();
    const itemsData = await tryGetGameItemsData(user.id);

    return (
      <MetricPage
        itemsData={itemsData}
        userId={user.id}
        metrics={PlatformsMetricsIds.slice()}
      />
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
