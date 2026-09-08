'use client';

import Game from '@ts/games/game';
import {
  FetchPeriodTopsMetricParams,
  MetricContentProps,
  PeriodPlaytimeTops,
  PeriodTopsMetric
} from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import { PlatformPeriodPlaytimeData } from '../types';

const getPlatformsPeriods =
  (platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>) =>
  async (
    params: FetchPeriodTopsMetricParams
  ): Promise<MetricResponse<PeriodTopsMetric<PlatformPeriodPlaytimeData>>> => {
    const periodTops = await getMetricClient<PeriodPlaytimeTops>(
      '/api/games/platforms/periods',
      params
    );

    return {
      error: periodTops.error,
      data: !periodTops.data
        ? undefined
        : {
            periodType: periodTops.data.periodType,
            tops: periodTops.data.tops.map((periodTop) => ({
              period: periodTop.period,
              top: periodTop.top.map((item, i) => ({
                id: item.id,
                name: platforms.findByKey(item.id)?.name ?? 'Other',
                index: i,
                hours: item.hours,
                logo: platforms.findByKey(item.id)?.logo
              }))
            }))
          }
    };
  };

const platformItemContent = (value: PlatformPeriodPlaytimeData) => (
  <p className='h4 colored period-platform-title'>{value.name}</p>
);

export default function PlatformsPeriodTops({
  metricId,
  games,
  userId
}: MetricContentProps) {
  const platforms = games.mapByKey<Game['platform'], 'id'>(
    (game) => game.platform,
    'id'
  );

  return (
    <PeriodTops
      id={metricId}
      userId={userId}
      fetchPeriodMetric={getPlatformsPeriods(platforms)}
      listItemContent={platformItemContent}
      displayFields={['hours']}
      valueField='hours'
      showBar
      fieldsNames={{
        id: { name: 'ID' },
        name: { name: 'Platform' },
        index: { name: '№' },
        percent: { name: '%' },
        hours: { name: 'Hours' },
        logo: { name: 'Logo' }
      }}
    />
  );
}
