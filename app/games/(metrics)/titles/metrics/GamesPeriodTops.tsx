'use client';

import Game from '@ts/games/game';
import {
  FetchPeriodTopsMetricParams,
  MetricContentProps,
  PeriodPlaytimeTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import GameTableTitle from '@components/data-blocks/GameTitle';
import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GamePeriodTopData } from '../types';

const fetchGamesPeriodTops =
  (games: ObjectMapArray<Game, 'id'>) =>
  async (
    params: FetchPeriodTopsMetricParams
  ): Promise<MetricResponse<PeriodTopsMetric<GamePeriodTopData>>> => {
    const gamesTops = await getMetricClient<PeriodPlaytimeTops>(
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
                .map((entry, i) => {
                  const game = games.findByKey(entry.id.toString());
                  if (!game) return undefined;
                  return { ...game, index: i };
                })
                .filter((game) => !!game)
            }))
          }
    };
  };

const gameItemContent = (value: GamePeriodTopData, i: number) => (
  <div className='ranked-entry'>
    <RankIcon rank={i} />
    <GameTableTitle game={value} />
  </div>
);

export default function GamesPeriodTops({
  metricId,
  games,
  userId
}: MetricContentProps) {
  return (
    <PeriodTops
      id={metricId}
      userId={userId}
      className='games-period-tops'
      blockWidthRem={18.5}
      fetchPeriodMetric={fetchGamesPeriodTops(games)}
      listItemContent={gameItemContent}
      displayFields={['hours']}
      valueField='hours'
      fieldsNames={{
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
