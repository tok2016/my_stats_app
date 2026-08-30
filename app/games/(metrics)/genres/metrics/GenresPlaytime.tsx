'use server';

import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import GenresPlaytimeChart from '../charts/GenresPlaytimeChart';
import { GenresPlaytimeData } from '../types';

type GenresPlaytimeProps = {
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
};

export default async function GenresPlaytime({ genres }: GenresPlaytimeProps) {
  const playtimeData = await getMetricData<PlaytimeData[]>(
    '/api/games/genres/playtime',
    []
  );

  const genresPlaytimeData: GenresPlaytimeData[] = playtimeData.map(
    (value, i) => ({
      ...value,
      id: value.id,
      name: genres.findByKey(value.id)?.name ?? 'Other',
      index: i
    })
  );

  return <GenresPlaytimeChart data={genresPlaytimeData} />;
}
