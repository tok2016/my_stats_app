'use server';

import { ChartData } from '@ts/ui/charts-data';

import { getGenresCount } from '@lib/server-actions';
import { MAX_ENTRIES_IN_CHART } from '@lib/utils';

import GenresCountChart from './GenresCountChart';

type GenreCount = ChartData & {
  count: number;
  percent: number;
  seriesName?: number;
};

export default async function GenresCount() {
  const countData = await getGenresCount();

  const sum = countData
    .map((genre) => genre.count)
    .reduce((prev, curr) => prev + curr, 0);

  const minPercent = (countData[0].count / (sum * MAX_ENTRIES_IN_CHART)) * 100;

  const genres: GenreCount[] = [];
  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = countData[i];
    const percent = (data.count / sum) * 100;

    if (percent < minPercent || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      const topSeries = new Map<number, number>();

      countData.slice(i).forEach((restData) => {
        count += restData.count;
        if (restData.topSeries)
          topSeries.set(
            restData.topSeries,
            (topSeries.get(restData.topSeries) ?? 0) + 1
          );
      });

      genres.push({
        id: -1,
        name: 'Other',
        index: i,
        count,
        value: count,
        percent: Math.round((count / sum) * 100),
        seriesName: topSeries
          .entries()
          .reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev))[0]
      });

      break;
    }

    genres.push({
      id: Number(data.id),
      index: i,
      name: data.id.toString(),
      count: data.count,
      value: data.count,
      percent: Math.round(percent),
      seriesName: data.topSeries
    });
  }

  return <GenresCountChart data={genres} />;
}
