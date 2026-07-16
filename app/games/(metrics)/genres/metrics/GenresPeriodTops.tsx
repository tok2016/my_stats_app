'use client';

import Game from '@ts/games/game';
import { PeriodPlaytimeTops, PeriodTopsMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GenresPeriodPlaytimeData } from '../types';

type Genre = Game['genres'][number];

type GenresPeriodTopsProps = {
  genresMap: Map<number | string, Genre>;
};

const getGenresPeriodTops =
  (genresMap: Map<number | string, Genre>) =>
  async (): Promise<PeriodTopsMetric<GenresPeriodPlaytimeData>> => {
    const periodTops = await getMetricData<PeriodPlaytimeTops>(
      '/api/games/genres/periods',
      {
        periodType: 'month',
        tops: []
      }
    );

    return {
      periodType: periodTops.periodType,
      tops: periodTops.tops.map((periodTop) => ({
        period: periodTop.period,
        top: periodTop.top.map((item, i) => ({
          id: item.id,
          name: genresMap.get(item.id)?.name ?? '',
          index: i,
          hours: item.hours
        }))
      }))
    };
  };

const genreItemContent = (genre: GenresPeriodPlaytimeData, i: number) => (
  <>
    <RankIcon rank={i} />
    <span>{genre.name}</span>
  </>
);

export default function GenresPeriodTops({ genresMap }: GenresPeriodTopsProps) {
  return (
    <PeriodTops
      id='genres-periods'
      title='Your most played genres'
      listItemContent={genreItemContent}
      getPeriodMetric={getGenresPeriodTops(genresMap)}
      displayFields={['hours']}
      valueField='hours'
      fieldsNames={{
        id: { name: 'ID' },
        name: { name: 'Genre' },
        index: { name: '№' },
        hours: { name: 'Hours' },
        percent: { name: '%' }
      }}
    />
  );
}
