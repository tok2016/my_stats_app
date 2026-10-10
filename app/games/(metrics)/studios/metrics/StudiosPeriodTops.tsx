'use client';

import { CodeCircleSolid, EarthSolid } from '@mynaui/icons-react';

import Game from '@ts/games/game';
import {
  FetchPeriodTopsMetricParams,
  MetricCoreProps,
  PeriodTopsMetric
} from '@ts/games/metric';
import { StudioType, StudiosPeriodMetric } from '@ts/games/studio';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import { StudioFullPeriodTopData } from '../types';

/**
 * @param studios - All studios of user's games.
 * @returns Funtion to fetch top developer and publisher by period.
 */
const getStudioPeriodMetric =
  (studios: ObjectMapArray<Game['developers'][number], 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top developer and publisher by period or error data.
   */
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
                name: studios.findByKey(entry.id)?.name ?? 'Other'
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

/**
 * @param props
 * @param props.studios - All studios of user's games.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component for top developer and publisher by period.
 */
export default function StudiosPeriodTops({
  studios,
  userId
}: MetricCoreProps) {
  return (
    <PeriodTops
      id='studios-periods'
      userId={userId}
      listItemContent={studioItemContent}
      fetchPeriodMetric={getStudioPeriodMetric(studios)}
      displayFields={['hours']}
      valueField='hours'
      fieldsInfo={{
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
