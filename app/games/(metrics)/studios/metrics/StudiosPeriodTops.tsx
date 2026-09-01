'use client';

import { CodeCircleSolid, EarthSolid } from '@mynaui/icons-react';

import Game from '@ts/games/game';
import {
  MetricClientContentProps,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';
import { StudioType, StudiosPeriodMetric } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import { StudioFullPeriodTopData } from '../types';

const getStudioPeriodMetric =
  (
    developers: ObjectMapArray<Game['developers'][number], 'id'>,
    publishers: ObjectMapArray<Game['publishers'][number], 'id'>,
    userId: string
  ) =>
  async (
    periodType?: PrecisePeriod
  ): Promise<PeriodTopsMetric<StudioFullPeriodTopData>> => {
    const periodMetric = await getMetricData<StudiosPeriodMetric>(
      '/api/games/studios/periods',
      {
        periodType: 'season',
        tops: []
      },
      userId,
      {
        period: periodType ?? 'season'
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
  metricId,
  games,
  userId
}: MetricClientContentProps) {
  const gamesMapArray = new ObjectMapArray(games, 'id');
  const developers = gamesMapArray.flatMapByKey<
    Game['developers'][number],
    'id'
  >((game) => game.developers, 'id');
  const publishers = gamesMapArray.flatMapByKey<
    Game['publishers'][number],
    'id'
  >((game) => game.publishers, 'id');

  return (
    <PeriodTops
      id={metricId}
      listItemContent={studioItemContent}
      getPeriodMetric={getStudioPeriodMetric(developers, publishers, userId)}
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
