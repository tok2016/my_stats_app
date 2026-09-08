'use client';

import Game from '@ts/games/game';
import {
  FetchPeriodTopsMetricParams,
  MetricContentProps,
  PeriodPlaytimeTops,
  PeriodTopsMetric
} from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

import { GenresPeriodPlaytimeData } from '../types';

type Genre = Game['genres'][number];

const getGenresPeriodTops =
  (genres: ObjectMapArray<Genre, 'id'>) =>
  async (
    params: FetchPeriodTopsMetricParams
  ): Promise<MetricResponse<PeriodTopsMetric<GenresPeriodPlaytimeData>>> => {
    const periodTops = await getMetricClient<PeriodPlaytimeTops>(
      '/api/games/genres/periods',
      params
    );

    return {
      error: periodTops.error,
      data: !periodTops.data
        ? undefined
        : {
            periodType: periodTops.data.periodType,
            tops: periodTops.data.tops.map((periodTop) => ({
              period: periodTop.period,
              top: periodTop.top.map((item, i) => ({
                id: item.id,
                name: genres.findByKey(item.id)?.name ?? 'Other',
                index: i,
                hours: item.hours
              }))
            }))
          }
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
}: MetricContentProps) {
  const genres = games.flatMapByKey<Genre, 'id'>((game) => game.genres, 'id');

  return (
    <PeriodTops
      id={metricId}
      userId={userId}
      listItemContent={genreItemContent}
      fetchPeriodMetric={getGenresPeriodTops(genres)}
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
