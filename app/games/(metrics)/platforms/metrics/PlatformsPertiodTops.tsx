'use client';

import Game from '@ts/games/game';
import {
  PeriodPlaytimeTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import { PlatformPeriodPlaytimeData } from '../types';

type PlatformsPeriodTopsProps = {
  platforms: NonNullable<Game['platform']>[];
};

const getPlatformsPeriods =
  (platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>) =>
  async (
    periodType?: PrecisePeriod
  ): Promise<PeriodTopsMetric<PlatformPeriodPlaytimeData>> => {
    const searchParams = new URLSearchParams({
      period: periodType ?? 'season'
    });

    const periodTops = await getMetricData<PeriodPlaytimeTops>(
      `/api/games/platforms/periods?${searchParams.toString()}`,
      {
        periodType: 'season',
        tops: []
      }
    );

    return {
      periodType: periodTops.periodType,
      tops: periodTops.tops.map((periodTop) => ({
        period: periodTop.period,
        top: periodTop.top.map((item, i) => ({
          id: item.id,
          name: platforms.findByKey(item.id)?.name ?? 'Other',
          index: i,
          hours: item.hours,
          logo: platforms.findByKey(item.id)?.logo
        }))
      }))
    };
  };

const platformItemContent = (value: PlatformPeriodPlaytimeData) => (
  <p className='h4 colored period-platform-title'>{value.name}</p>
);

export default function PlatformsPeriodTops({
  platforms
}: PlatformsPeriodTopsProps) {
  return (
    <PeriodTops
      id='platform-periods'
      title='Your favorite platform'
      getPeriodMetric={getPlatformsPeriods(new ObjectMapArray(platforms, 'id'))}
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
