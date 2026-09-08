'use client';

import Game from '@ts/games/game';
import { CountData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GenresCountChart from '../charts/GenresCountChart';
import { GenresCountData } from '../types';

type GenresCountProps = {
  seriesArray: ObjectMapArray<NonNullable<Game['series']>, 'id'>;
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
  userId: string;
};

const fetchGenresCount =
  (
    genres: ObjectMapArray<Game['genres'][number], 'id'>,
    series: ObjectMapArray<NonNullable<Game['series']>, 'id'>
  ) =>
  async (params: {
    userId: string;
  }): Promise<MetricResponse<GenresCountData[]>> => {
    const countData = await getMetricClient<CountData[]>(
      '/api/games/genres/count',
      params
    );

    return {
      error: countData.error,
      data: countData.data?.map((data, i) => ({
        ...data,
        index: i,
        name: genres.findByKey(data.id)?.name ?? 'Other',
        topSeries: series.findByKey(data.topSeries ?? ''),
        reservedValue: data.count
      }))
    };
  };

export default function GenresCount({
  seriesArray,
  genres,
  userId
}: GenresCountProps) {
  return (
    <MetricWrapper id='genres-count' submetric>
      <FetchMetric
        fetchMetricData={fetchGenresCount(genres, seriesArray)}
        fallback={
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        }
        metric={(data) => <GenresCountChart data={data} />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
