'use client';

import Game from '@ts/games/game';
import { CountData, MetricCoreProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GenresCountChart from '../charts/GenresCountChart';
import { GenresCountData } from '../types';

/**
 * @param genres - All genres of user's games.
 * @param series - All series of of user's games.
 * @returns Funtion to fetch top genres by games count.
 */
const fetchGenresCount =
  (
    genres: ObjectMapArray<Game['genres'][number], 'id'>,
    series: ObjectMapArray<NonNullable<Game['series']>, 'id'>
  ) =>
  /**
   * @param params - Search params with user id.
   * @returns Top genres by games count or error data.
   */
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

/**
 * @param props
 * @param props.genres - All genres of user's games.
 * @param props.series - All series of of user's games.
 * @param props.userId - User whose metric will be fetched.
 * @returns Submetric component of top genres by games count.
 */
export default function GenresCount({
  genres,
  series,
  userId
}: MetricCoreProps) {
  return (
    <MetricWrapper id='genres-count' submetric>
      <FetchMetric
        fetchMetricData={fetchGenresCount(genres, series)}
        fallback={
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        }
        metric={(data) => <GenresCountChart data={data} />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
