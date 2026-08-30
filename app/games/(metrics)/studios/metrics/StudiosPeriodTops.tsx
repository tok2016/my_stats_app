'use client';

import { CodeCircleSolid, EarthSolid } from '@mynaui/icons-react';

import Game from '@ts/games/game';
import { PeriodTopsMetric, PrecisePeriod } from '@ts/games/metric';
import { StudioType, StudiosPeriodMetric } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import { StudioFullPeriodTopData } from '../types';

type StudiosPeriodTopsProps = {
  developers: Game['developers'];
  publishers: Game['publishers'];
};

const getStudioPeriodMetric =
  (
    developers: ObjectMapArray<Game['developers'][number], 'id'>,
    publishers: ObjectMapArray<Game['publishers'][number], 'id'>
  ) =>
  async (
    periodType?: PrecisePeriod
  ): Promise<PeriodTopsMetric<StudioFullPeriodTopData>> => {
    const searchParams = new URLSearchParams({
      period: periodType ?? 'season'
    });
    const periodMetric = await getMetricData<StudiosPeriodMetric>(
      `/api/games/studios/periods?${searchParams.toString()}`,
      {
        periodType: 'season',
        tops: []
      }
    );

    return {
      periodType: periodMetric.periodType as PrecisePeriod,
      tops: periodMetric.tops.map((periodTop) => ({
        period: periodTop.period,
        top: periodTop.top.map((entry, i) => ({
          id: entry.id,
          hours: entry.hours,
          type: entry.type as StudioType,
          index: i,
          name:
            developers.findByKey(entry.id)?.name
            ?? publishers.findByKey(entry.id)?.name
            ?? 'Other'
        }))
      }))
    };
  };

const studioItemContent = (item: StudioFullPeriodTopData) => (
  <>
    {item.type === 'developer' ? (
      <CodeCircleSolid className='colored' />
    ) : (
      <EarthSolid className='colored' />
    )}
    <span className='colored bold'>{item.name}</span>
  </>
);

export default function StudiosPeriodTops({
  developers,
  publishers
}: StudiosPeriodTopsProps) {
  return (
    <PeriodTops
      id='studios-period'
      title='Your favorite developer & publisher'
      listItemContent={studioItemContent}
      getPeriodMetric={getStudioPeriodMetric(
        new ObjectMapArray(developers, 'id'),
        new ObjectMapArray(publishers, 'id')
      )}
      displayFields={['hours']}
      valueField='hours'
      fieldsNames={{
        id: { name: 'ID' },
        index: { name: '№' },
        hours: { name: 'Hours' },
        name: { name: 'Studio' },
        type: { name: 'Type' },
        percent: { name: '%' }
      }}
    />
  );
}
