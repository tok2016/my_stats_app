'use client';

import { ChartPieTwoSolid, TableSolid } from '@mynaui/icons-react';

import Link from 'next/link';

import DoughnutChart from '@components/charts/DoughnutChart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

type GenreCount = {
  id: number;
  name: string;
  count: number;
  percent: number;
  value: number;
  seriesName?: number;
};

type GenresCountChartProps = {
  data: GenreCount[];
};

const fieldsNames: Record<keyof GenreCount, string> = {
  id: 'ID',
  name: 'Name',
  count: 'Games Count',
  percent: 'Percent',
  seriesName: 'Best series',
  value: 'value'
};

const rowContent = (data: GenreCount, i: number) => (
  <>
    <div>{i + 1}</div>
    <div>
      <Link href={`/games/genres/${data.id}`} className='bold colored'>
        {data.name}
      </Link>
    </div>
    <div>{data.count}</div>
    <div>
      {data.seriesName ? (
        <Link href={`/games/series/${data.seriesName}`} className='underline'>
          {data.seriesName}
        </Link>
      ) : (
        '-'
      )}
    </div>
  </>
);

export default function GenresCountChart({ data }: GenresCountChartProps) {
  return (
    <SwitchableChart
      className='test-chart'
      chartsOptions={[
        {
          chart: (
            <DoughnutChart
              key='genres-count-1'
              chartId='genres-count-1'
              data={data}
              displayFields={['count', 'seriesName']}
              fieldsNames={fieldsNames}
            />
          ),
          icon: <ChartPieTwoSolid />
        },
        {
          chart: (
            <Table
              key='genres-count-table'
              data={data.filter((genre) => genre.id > 0)}
              headers={{
                name: 'Genre',
                count: 'Games',
                seriesName: 'Biggest Series'
              }}
              rowContent={rowContent}
            />
          ),
          icon: <TableSolid />
        }
      ]}
    />
  );
}
