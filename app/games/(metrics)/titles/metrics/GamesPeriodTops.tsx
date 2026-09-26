'use client';

import Game from '@ts/games/game';
import {
  CoreMetricProps,
  FetchPeriodTopsMetricParams,
  PeriodPlaytimeTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import GameTitle from '@components/data-blocks/GameTitle';
import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GamePeriodTopData } from '../types';

/**
 * @param games - All user's games.
 * @returns Funtion to fetch top games by period.
 */
const fetchGamesPeriodTops =
  (games: ObjectMapArray<Game, 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top games by period or error data.
   */
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
    <GameTitle game={value} />
  </div>
);

/**
 * @param props
 * @param props.games - Games of user.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component for top games by period.
 */
export default function GamesPeriodTops({ games, userId }: CoreMetricProps) {
  return (
    <PeriodTops
      id='games-periods'
      userId={userId}
      className='games-period-tops'
      blockWidthRem={18.5}
      fetchPeriodMetric={fetchGamesPeriodTops(games)}
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
