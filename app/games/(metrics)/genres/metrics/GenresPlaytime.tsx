'use client';

import Game from '@ts/games/game';
import { MetricCoreProps, PlaytimeData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GenresPlaytimeChart from '../charts/GenresPlaytimeChart';
import { GenresPlaytimeData } from '../types';

/**
 * @param genres - All genres of user's games.
 * @returns Funtion to fetch top genres by playtime.
 */
const fetchGenresPlaytime =
  (genres: ObjectMapArray<Game['genres'][number], 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top genres by playtime or error data.
   */
  async (params: {
    userId: string;
  }): Promise<MetricResponse<GenresPlaytimeData[]>> => {
    const playtimeData = await getMetricClient<PlaytimeData[]>(
      '/api/games/genres/playtime',
      params
    );

    return {
      error: playtimeData.error,
      data: playtimeData.data?.map((value, i) => ({
        ...value,
        id: value.id,
        name: genres.findByKey(value.id)?.name ?? 'Other',
        index: i
      }))
    };
  };

/**
 * @param props
 * @param props.genres - All genres of user's games.
 * @param props.userId - User whose metric will be fetched.
 * @returns Submetric component of top genres by playtime.
 */
export default function GenresPlaytime({ genres, userId }: MetricCoreProps) {
  return (
    <MetricWrapper id='genres-playtime' submetric>
      <FetchMetric
        fetchMetricData={fetchGenresPlaytime(genres)}
        metric={(data) => <GenresPlaytimeChart data={data} />}
        fallback={
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        }
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
