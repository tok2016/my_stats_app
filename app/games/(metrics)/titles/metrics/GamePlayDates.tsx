import { YearCountMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GamesLineChart from '../charts/GamesLineChart';
import { GameYearChartData } from '../types';

export default async function GamePlaydates() {
  const years = await getMetricData<YearCountMetric[]>(
    '/api/games/titles/playdate',
    []
  );

  const chartData: GameYearChartData[] = years.map((year) => ({
    id: year.year,
    name: year.year.toString(),
    year: year.year,
    count: year.count,
    index: 0,
    topGame: year.topGames[0].name
  }));

  return <GamesLineChart data={chartData} chartId='game-playdates-line' />;
}
