import Game from '@ts/games/game';
import { CountData } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import GenresCountChart from '../charts/GenresCountChart';
import { GenresCountData } from '../types';

type GenresCountProps = {
  seriesArray: ObjectMapArray<NonNullable<Game['series']>, 'id'>;
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
  userId: string;
};

export default async function GenresCount({
  seriesArray,
  genres,
  userId
}: GenresCountProps) {
  const countData = await getMetricData<CountData[]>(
    '/api/games/genres/count',
    [],
    userId
  );

  const genresCount: GenresCountData[] = countData.map((data, i) => ({
    ...data,
    index: i,
    name: genres.findByKey(data.id)?.name ?? 'Other',
    topSeries: seriesArray.findByKey(data.topSeries ?? ''),
    reservedValue: data.count
  }));

  return <GenresCountChart data={genresCount} />;
}
