'use client';

import { Check, Plus } from '@mynaui/icons-react';

import { MetricId } from '@ts/games/metric';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction } from '@lib/hooks';
import { getErrorFormState } from '@lib/utils';

import { useUserState } from '@store/user-store';

import IconButton from '@components/IconButton';

type AddMetricButtonProps = {
  metricId: MetricId;
};

/**
 * Sends request to add given metric. If metric is stored, removes it from dashboard.
 * @param user - User to add metric for.
 * @param updateUser - Update user state function.
 * @returns Response status text.
 */
const toggleMetric =
  (
    user: ReturnType<typeof useUserState>['user'],
    updateUser: ReturnType<typeof useUserState>['setUserState']
  ) =>
  async (metricId?: MetricId) => {
    if (!metricId) return 'Metric ID was not given';

    try {
      const response = user.metrics.has(metricId)
        ? await AxiosInstanse.put<MetricId[]>(
            `/api/user/${user.id}/dashboard`,
            metricId
          )
        : await AxiosInstanse.post<MetricId[]>(
            `/api/user/${user.id}/dashboard`,
            metricId
          );

      updateUser({ user: { ...user, metrics: new Set(response.data) } });
      return response.statusText;
    } catch (err) {
      return getErrorFormState(err).message;
    }
  };

/**
 * @param props
 * @param props.metricId - ID of metric to add or remove.
 * @returns Button that adds metric to dashboard or removes from it.
 */
export default function AddMetricButton({ metricId }: AddMetricButtonProps) {
  const { user, setUserState } = useUserState();
  const [, updateMetric, isPending] = useAction(
    toggleMetric(user, setUserState),
    ''
  );

  const onMetricAddClick = () => {
    updateMetric(metricId);
  };

  //If metric is stored, displays remove button.
  const isStored = user.metrics.has(metricId);

  return (
    <IconButton
      icon={isStored ? <Check /> : <Plus />}
      variant={isStored ? 'primary' : 'secondary'}
      className={isStored ? 'success' : ''}
      loading={isPending}
      onClick={onMetricAddClick}
    />
  );
}
