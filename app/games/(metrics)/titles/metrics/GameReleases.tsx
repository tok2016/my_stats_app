import { YearCountMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GamesLineChart from '../charts/GamesLineChart';
import { GameYearChartData } from '../types';

export default async function GameReleases() {
  const years = await getMetricData<YearCountMetric[]>(
    '/api/games/titles/release',
    []
  );

  const chartData: GameYearChartData[] = years.map((year) => ({
    id: year.year,
    name: year.year.toString(),
    year: year.year,
    count: year.count,
    index: 0,
    topGame: year.topGames[0]?.name ?? 'no'
  }));

  return <GamesLineChart data={chartData} chartId='games-releases-line' />;
}
