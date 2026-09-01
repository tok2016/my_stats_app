'use client';

import Game from '@ts/games/game';
import {
  MetricClientContentProps,
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

const getGenresPeriodTops =
  (genres: ObjectMapArray<Genre, 'id'>, userId: string) =>
  async (
    periodType?: PrecisePeriod
  ): Promise<PeriodTopsMetric<GenresPeriodPlaytimeData>> => {
    const periodTops = await getMetricData<PeriodPlaytimeTops>(
      '/api/games/genres/periods',
      {
        periodType: 'season',
        tops: []
      },
      userId,
      {
        period: periodType ?? 'season'
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
  <div className='ranked-entry'>
    <RankIcon rank={i} />
    <span>{genre.name}</span>
  </div>
);

export default function GenresPeriodTops({
  metricId,
  games,
  userId
}: MetricClientContentProps) {
  const genres = new ObjectMapArray(games, 'id').flatMapByKey<Genre, 'id'>(
    (game) => game.genres,
    'id'
  );

  return (
    <PeriodTops
      id={metricId}
      listItemContent={genreItemContent}
      getPeriodMetric={getGenresPeriodTops(genres, userId)}
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
