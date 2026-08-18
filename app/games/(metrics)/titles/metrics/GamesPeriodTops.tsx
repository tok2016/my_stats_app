'use client';

import Game from '@ts/games/game';
import {
  PeriodPlaytimeTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GameTableTitle from '@components/data-blocks/GameTitle';
import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GamePeriodTopData } from '../types';

type GamesPeriodTopsProps = {
  gamesMap: Map<string, Game>;
};

const getGamesPeriodTops =
  (gamesMap: Map<string, Game>) =>
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
            const game = gamesMap.get(entry.id.toString());
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

export default function GamesPeriodTops({ gamesMap }: GamesPeriodTopsProps) {
  return (
    <PeriodTops
      id='games-periods'
      className='games-period-tops'
      title='Your longest played games'
      blockWidthRem={18.5}
      getPeriodMetric={getGamesPeriodTops(gamesMap)}
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
