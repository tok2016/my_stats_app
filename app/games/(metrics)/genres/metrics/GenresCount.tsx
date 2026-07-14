'use server';

import Game from '@ts/games/game';
import { CountData } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GenresCountChart from '../charts/GenresCountChart';
import { GenresCountData } from '../types';

type GenresCountProps = {
  seriesMap: Map<number | string, Game['series']>;
  genresMap: Map<number | string, Game['genres'][number]>;
};

export default async function GenresCount({
  seriesMap,
  genresMap
}: GenresCountProps) {
  const countData = await getMetricData<CountData[]>(
    '/api/games/genres/count',
    []
  );

  const genresCount: GenresCountData[] = countData.map((data, i) => ({
    ...data,
    index: i,
    name: genresMap.get(data.id)?.name ?? '',
    topSeries: seriesMap.get(data.topSeries ?? ''),
    reservedValue: data.count
  }));

  return <GenresCountChart data={genresCount} />;
}
