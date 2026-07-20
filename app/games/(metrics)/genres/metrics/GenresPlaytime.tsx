'use server';

import Game from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import genrePlaytimeData from '../../../../../mock data/genres/genres-playtime.json';
import GenresPlaytimeChart from '../charts/GenresPlaytimeChart';
import { GenresPlaytimeData } from '../types';

type GenresPlaytimeProps = {
  genresMap: Map<number | string, Game['genres'][number]>;
};

export default async function GenresPlaytime({
  genresMap
}: GenresPlaytimeProps) {
  // const playtimeData = await getMetricData<PlaytimeData[]>(
  //   '/api/games/genres/playtime',
  //   []
  // );

  const playtimeData = genrePlaytimeData;

  const genresPlaytimeData: GenresPlaytimeData[] = playtimeData.map(
    (value, i) => ({
      ...value,
      id: value.id,
      name: genresMap.get(value.id)?.name ?? '',
      index: i
    })
  );

  return (
    <section className='metric'>
      <h3>Your longest played genres</h3>
      <GenresPlaytimeChart data={genresPlaytimeData} />
    </section>
  );
}
