'use client';

import { Check, Plus } from '@mynaui/icons-react';

import { MetricId } from '@ts/games/metric';
import { User, UserUpdate } from '@ts/users/user';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction } from '@lib/hooks';
import { getErrorFormState } from '@lib/utils';

import { useUserState } from '@store/user-store';

import IconButton from '@components/IconButton';

type AddMetricButtonProps = {
  metricId: MetricId;
};

const toggleMetric =
  (
    user: ReturnType<typeof useUserState>['user'],
    updateUser: ReturnType<typeof useUserState>['setUserState']
  ) =>
  async (metricId?: MetricId) => {
    if (!metricId) return 'Metric ID was not given';

    const updatedMetrics = new Set(user.metrics);
    if (updatedMetrics.has(metricId)) updatedMetrics.delete(metricId);
    else updatedMetrics.add(metricId);

    const userUpdate: UserUpdate = {
      metrics: updatedMetrics.values().toArray()
    };

    try {
      const response = await AxiosInstanse.put<User>('/api/user', userUpdate);
      updateUser({ user: { ...response.data, metrics: updatedMetrics } });
      return response.statusText;
    } catch (err) {
      return getErrorFormState(err).message;
    }
  };

export default function AddMetricButton({ metricId }: AddMetricButtonProps) {
  const { user, setUserState } = useUserState();
  const [, updateMetric, isPending] = useAction(
    toggleMetric(user, setUserState),
    ''
  );

  const isStored = user.metrics.has(metricId);

  const onMetricAddClick = () => {
    updateMetric(metricId);
  };

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
