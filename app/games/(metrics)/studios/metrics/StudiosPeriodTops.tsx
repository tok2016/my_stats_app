'use client';

import { CodeCircleSolid, EarthSolid } from '@mynaui/icons-react';

import Game from '@ts/games/game';
import {
  FetchPeriodTopsMetricParams,
  MetricContentProps,
  PeriodTopsMetric
} from '@ts/games/metric';
import { StudioType, StudiosPeriodMetric } from '@ts/games/studio';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import { StudioFullPeriodTopData } from '../types';

const getStudioPeriodMetric =
  (
    developers: ObjectMapArray<Game['developers'][number], 'id'>,
    publishers: ObjectMapArray<Game['publishers'][number], 'id'>
  ) =>
  async (
    params: FetchPeriodTopsMetricParams
  ): Promise<MetricResponse<PeriodTopsMetric<StudioFullPeriodTopData>>> => {
    const periodMetric = await getMetricClient<StudiosPeriodMetric>(
      '/api/games/studios/periods',
      params
    );

    return {
      error: periodMetric.error,
      data: !periodMetric.data
        ? undefined
        : {
            periodType: periodMetric.data.periodType,
            tops: periodMetric.data.tops.map((periodTop) => ({
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
          }
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
}: MetricContentProps) {
  const developers = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game.developers,
    'id'
  );

  const publishers = games.flatMapByKey<Game['publishers'][number], 'id'>(
    (game) => game.publishers,
    'id'
  );

  return (
    <PeriodTops
      id={metricId}
      userId={userId}
      listItemContent={studioItemContent}
      fetchPeriodMetric={getStudioPeriodMetric(developers, publishers)}
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
