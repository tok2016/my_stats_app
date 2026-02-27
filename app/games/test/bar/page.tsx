'use client';

import Link from 'next/link';

import { IndexBarChartData } from '@ts/ui/charts-data';

import AdjacentChart from '@components/charts/AdjacentChart';
import BarChart from '@components/charts/BarChart';
import Table from '@components/charts/Table';

import countTestData from '../../../../mock data/count-test-data.json';

type StudioCount = IndexBarChartData & {
  count: number;
  hours: number;
  seriesName?: number;
};

const fieldsNames: Record<keyof StudioCount, string> = {
  id: 'ID',
  name: 'Name',
  seriesName: 'Best Series',
  count: 'Games',
  hours: 'Hours',
  value: 'Value',
  index: 'Rank'
};

export default function BarPage() {
  const studios: StudioCount[] = countTestData.slice(0, 10).map((data, i) => ({
    id: data.id,
    name: data.id.toString(),
    seriesName: data.topSeries,
    index: i,
    value: 0,
    count: data.count,
    hours: Math.round(Math.random() * 100000) % 100
  }));

  return (
    <AdjacentChart>
      <Table
        id='studios-table'
        data={studios}
        headers={{
          name: 'Name',
          count: 'Games',
          hours: 'Hours',
          seriesName: 'Longest Played Series'
        }}
        rowContent={(data, index) => (
          <>
            <span>{index + 1}</span>
            <Link
              href={`/games/studios/${data.id}`}
              data-rank={data.index}
              className='bold colored'
            >
              {data.name}
            </Link>
            <span>{data.count}</span>
            <span>{data.hours}</span>
            {data.seriesName ? (
              <Link
                href={`/games/series/${data.seriesName}`}
                className='underline'
              >
                {data.seriesName}
              </Link>
            ) : (
              <span>no data</span>
            )}
          </>
        )}
      />

      <BarChart
        horizontal
        chartId='studios-bar-chart'
        data={studios}
        displayFields={['count', 'hours', 'seriesName']}
        fieldsNames={fieldsNames}
        valueFields={['count', 'hours']}
      />
    </AdjacentChart>
  );
}
