'use client';

import { useEffect } from 'react';

import { MetricResponse } from '@ts/requests';

import { useAction } from '@lib/hooks';

import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';

type FetchMetricProps<
  MetricData,
  FetchParams extends object & { userId: string }
> = {
  metric: (data: MetricData) => React.ReactNode;
  fallback: React.ReactNode;
  fetchMetricData: (params: FetchParams) => Promise<MetricResponse<MetricData>>;
  params: FetchParams;
};

export default function FetchMetric<
  MetricData,
  FetchParams extends object & { userId: string }
>({
  metric,
  fallback,
  fetchMetricData,
  params
}: FetchMetricProps<MetricData, FetchParams>) {
  const [data, fetchData, isPending] = useAction(fetchMetricData, null);

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  if (data?.error) {
    return (
      <ErrorMessage error={data.error} className='error-metric'>
        <Button variant='secondary' onClick={() => fetchData(params)}>
          Try again
        </Button>
      </ErrorMessage>
    );
  } else if (isPending || !data || !data.data) {
    return fallback;
  }

  return metric(data.data);
}
