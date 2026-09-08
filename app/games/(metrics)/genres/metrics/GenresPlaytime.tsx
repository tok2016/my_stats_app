'use client';

import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import GenresPlaytimeChart from '../charts/GenresPlaytimeChart';
import { GenresPlaytimeData } from '../types';

type GenresPlaytimeProps = {
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
  userId: string;
};

const fetchGenresPlaytime =
  (genres: ObjectMapArray<Game['genres'][number], 'id'>) =>
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

export default function GenresPlaytime({
  genres,
  userId
}: GenresPlaytimeProps) {
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
