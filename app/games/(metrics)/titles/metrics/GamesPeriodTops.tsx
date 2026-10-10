'use client';

import {
  FetchPeriodTopsMetricParams,
  MetricCoreProps,
  PeriodGamesTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import GameTitle from '@components/data-blocks/GameTitle';
import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GamePeriodChartData } from '../types';

/**
 * @param params - Search params with user id.
 * @returns Top games by period or error data.
 */
const fetchGamesPeriodTops = async (
  params: FetchPeriodTopsMetricParams
): Promise<MetricResponse<PeriodTopsMetric<GamePeriodChartData>>> => {
  const gamesTops = await getMetricClient<PeriodGamesTops>(
    '/api/games/titles/periods',
    params
  );

  return {
    error: gamesTops.error,
    data: !gamesTops.data
      ? undefined
      : {
          periodType: gamesTops.data.periodType as PrecisePeriod,
          tops: gamesTops.data.tops.map((periodTop) => ({
            period: periodTop.period,
            top: periodTop.top
              .map((game, i) => ({ ...game, index: i }))
              .filter((game) => !!game)
          }))
        }
  };
};

const gameItemContent = (value: GamePeriodChartData, i: number) => (
  <div className='ranked-entry'>
    <RankIcon rank={i} />
    <GameTitle game={value} />
  </div>
);

/**
 * @param props
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component for top games by period.
 */
export default function GamesPeriodTops({ userId }: MetricCoreProps) {
  return (
    <PeriodTops
      id='games-periods'
      userId={userId}
      className='games-period-tops'
      blockWidthRem={18.5}
      fetchPeriodMetric={fetchGamesPeriodTops}
      listItemContent={gameItemContent}
      displayFields={['hours']}
      valueField='hours'
      fieldsInfo={{
        id: { name: 'ID' },
        index: { name: '№' },
        name: { name: 'Game' },
        hours: { name: 'Hours' },
        percent: { name: '%' },
        coverUrl: { name: 'Cover' },
        apiId: { name: 'ID' },
        rating: { name: 'Rating' }
      }}
    />
  );
}
