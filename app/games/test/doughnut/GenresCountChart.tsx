'use client';

import { ChartPieTwoSolid, TableSolid } from '@mynaui/icons-react';

import Link from 'next/link';

import { ChartData, FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

type GenreCount = ChartData & {
  count: number;
  percent: number;
  seriesName?: number;
};

type GenresCountChartProps = {
  data: GenreCount[];
};

const fieldsNames: FieldsInfo<GenreCount> = {
  id: { name: 'ID' },
  index: { name: '№' },
  name: { name: 'Name' },
  count: { name: 'Games Count' },
  percent: { name: 'Percent' },
  seriesName: { name: 'Best series' },
  value: { name: 'value' }
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
            <Chart
              type='doughnut'
              key='genres-count-1'
              chartId='genres-count-1'
              data={data}
              fieldsNames={fieldsNames}
              displayFields={['count', 'seriesName']}
              valueFields={['value']}
              showLegend
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
