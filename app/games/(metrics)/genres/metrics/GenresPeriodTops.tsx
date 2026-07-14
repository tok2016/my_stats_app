'use client';

import Game from '@ts/games/game';
import { PeriodTopsMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

type Genre = Game['genres'][number];

const getGenresPeriodTops = async (): Promise<PeriodTopsMetric<Genre>> => {
  const periodTops = await getMetricData<PeriodTopsMetric<Genre>>(
    '/api/games/genres/periods',
    {
      periodType: 'month',
      tops: []
    }
  );

  return periodTops;
};

const genreItemContent = (genre: Genre, i: number) => (
  <>
    <RankIcon rank={i} />
    <span>{genre.name}</span>
  </>
);

export default function GenresPeriodTops() {
  return (
    <PeriodTops
      id='genres-periods'
      title='Your most played genres'
      listItemContent={genreItemContent}
      getPeriodMetric={getGenresPeriodTops}
    />
  );
}
