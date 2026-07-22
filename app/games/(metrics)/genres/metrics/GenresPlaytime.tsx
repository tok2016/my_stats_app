'use server';

import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GenresPlaytimeChart from '../charts/GenresPlaytimeChart';
import { GenresPlaytimeData } from '../types';

type GenresPlaytimeProps = {
  genresMap: Map<number | string, Game['genres'][number]>;
};

export default async function GenresPlaytime({
  genresMap
}: GenresPlaytimeProps) {
  const playtimeData = await getMetricData<PlaytimeData[]>(
    '/api/games/genres/playtime',
    []
  );

  const genresPlaytimeData: GenresPlaytimeData[] = playtimeData.map(
    (value, i) => ({
      ...value,
      id: value.id,
      name: genresMap.get(value.id)?.name ?? 'Other',
      index: i
    })
  );

  return <GenresPlaytimeChart data={genresPlaytimeData} />;
}
