import Game from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';
import { CountData } from '@ts/games/metric';

import AxiosInstanse from '@lib/axios-instanse';

type ItemCountMetricProps = {
  genres: Map<number, IgdbGenre>;
  games: Map<string, Game>;
  url: string;
};

export default async function ItemCountMetric({
  genres,
  games,
  url
}: ItemCountMetricProps) {
  const response = await AxiosInstanse.get<CountData[]>(url);

  return <div className='chart'></div>;
}
