'use client';

import Game from '@ts/games/game';
import {
  MetricContentProps,
  PeriodPlaytimeTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import GameTableTitle from '@components/data-blocks/GameTitle';
import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GamePeriodTopData } from '../types';

const getGamesPeriodTops =
  (games: ObjectMapArray<Game, 'id'>) =>
  async (
    periodType?: PrecisePeriod
  ): Promise<PeriodTopsMetric<GamePeriodTopData>> => {
    const searchParams = new URLSearchParams({
      period: periodType ?? 'season'
    });
    const gamesTops = await getMetricData<PeriodPlaytimeTops>(
      `/api/games/titles/periods?${searchParams.toString()}`,
      {
        periodType: 'season',
        tops: []
      }
    );

    return {
      periodType: gamesTops.periodType as PrecisePeriod,
      tops: gamesTops.tops.map((periodTop) => ({
        period: periodTop.period,
        top: periodTop.top
          .map((entry, i) => {
            const game = games.findByKey(entry.id.toString());
            if (!game) return undefined;
            return { ...game, index: i };
          })
          .filter((game) => !!game)
      }))
    };
  };

const gameItemContent = (value: GamePeriodTopData, i: number) => (
  <div className='period-game'>
    <RankIcon rank={i} />
    <GameTableTitle game={value} />
  </div>
);

export default function GamesPeriodTops({
  metricId,
  games
}: MetricContentProps) {
  return (
    <PeriodTops
      id={metricId}
      className='games-period-tops'
      blockWidthRem={18.5}
      getPeriodMetric={getGamesPeriodTops(games)}
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
