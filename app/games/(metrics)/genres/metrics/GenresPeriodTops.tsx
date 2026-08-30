'use client';

import Game from '@ts/games/game';
import {
  PeriodPlaytimeTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GenresPeriodPlaytimeData } from '../types';

type Genre = Game['genres'][number];

type GenresPeriodTopsProps = {
  genres: Genre[];
};

const getGenresPeriodTops =
  (genres: ObjectMapArray<Genre, 'id'>) =>
  async (
    periodType?: PrecisePeriod
  ): Promise<PeriodTopsMetric<GenresPeriodPlaytimeData>> => {
    const searchParams = new URLSearchParams({
      period: periodType ?? 'season'
    });
    const periodTops = await getMetricData<PeriodPlaytimeTops>(
      `/api/games/genres/periods?${searchParams.toString()}`,
      {
        periodType: 'season',
        tops: []
      }
    );

    return {
      periodType: periodTops.periodType,
      tops: periodTops.tops.map((periodTop) => ({
        period: periodTop.period,
        top: periodTop.top.map((item, i) => ({
          id: item.id,
          name: genres.findByKey(item.id)?.name ?? 'Other',
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

export default function GenresPeriodTops({ genres }: GenresPeriodTopsProps) {
  return (
    <PeriodTops
      id='genres-periods'
      title='Your most played genres'
      listItemContent={genreItemContent}
      getPeriodMetric={getGenresPeriodTops(new ObjectMapArray(genres, 'id'))}
      displayFields={['hours']}
      valueField='hours'
      showBar
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
