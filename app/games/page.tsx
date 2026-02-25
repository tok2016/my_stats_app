'use client';

import { ChartPieTwoSolid, TableSolid } from '@mynaui/icons-react';

import Link from 'next/link';

import { MAX_ENTRIES_IN_CHART } from '@lib/utils';

import DoughnutChart from '@components/charts/DoughnutChart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

import testData from '../../mock data/count-test-data.json';

type GenreCount = {
  id: number;
  name: string;
  count: number;
  percent: number;
  value: number;
  seriesName?: number;
};

const fieldsNames: Record<keyof GenreCount, string> = {
  id: 'ID',
  name: 'Name',
  count: 'Games Count',
  percent: 'Percent',
  seriesName: 'Best series',
  value: 'value'
};

export default function GamesMainPage() {
  // return (
  //   <>
  //     <Link href='/games/genres'>Genres</Link>
  //     <Link href='/games/studios'>Developers & Publishers</Link>
  //     <Link href='/games/platforms'>Platforms</Link>
  //     <Link href='/games/titles'>Video Games</Link>
  //     <Link href='/games/library'>Library</Link>
  //   </>
  // );

  const sum = testData
    .map((genre) => genre.count)
    .reduce((prev, curr) => prev + curr, 0);

  const minPercent = (testData[0].count / (sum * MAX_ENTRIES_IN_CHART)) * 100;

  const genres: GenreCount[] = [];
  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = testData[i];
    const percent = (data.count / sum) * 100;

    if (percent < minPercent || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      const topSeries = new Map<number, number>();

      testData.slice(i).forEach((restData) => {
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
      id: data.id,
      name: data.id.toString(),
      count: data.count,
      value: data.count,
      percent: Math.round(percent),
      seriesName: data.topSeries
    });
  }

  return (
    <SwitchableChart
      className='test-chart'
      chartsOptions={[
        {
          chart: (
            <DoughnutChart
              key='genres-count-1'
              chartId='genres-count-1'
              className='test-count-chart'
              data={genres}
              displayFields={['count', 'seriesName']}
              fieldsNames={fieldsNames}
            />
          ),
          icon: <ChartPieTwoSolid />
        },
        {
          chart: (
            <Table
              data={genres.filter((genre) => genre.id > 0)}
              headers={{
                name: 'Genre',
                count: 'Games',
                seriesName: 'Biggest Series'
              }}
              rowContent={(data, i) => (
                <>
                  <div>{i + 1}</div>
                  <div>
                    <Link
                      href={`/games/genres/${data.id}`}
                      className='bold colored'
                    >
                      {data.name}
                    </Link>
                  </div>
                  <div>{data.count}</div>
                  <div>
                    {data.seriesName ? (
                      <Link
                        href={`/games/series/${data.seriesName}`}
                        className='underline'
                      >
                        {data.seriesName}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </div>
                </>
              )}
            />
          ),
          icon: <TableSolid />
        }
      ]}
    />
  );
}
