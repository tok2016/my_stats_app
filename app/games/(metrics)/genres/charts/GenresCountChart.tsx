'use client';

import { ChartPie, Table as TableIcon } from '@mynaui/icons-react';

import Link from 'next/link';

import { FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

import { GenresCountData } from '../types';

type GenresCountChartProps = {
  data: GenresCountData[];
};

type GenresCountForDoughnut = Omit<GenresCountData, 'topSeries'> & {
  topSeries?: string;
};

const genresCountFieldsNames: FieldsInfo<GenresCountForDoughnut> = {
  id: { name: 'ID' },
  name: { name: 'Genre' },
  count: { name: 'Games' },
  percent: { name: '%' },
  index: { name: '№' },
  topSeries: { name: 'Biggest series' }
};

const genresCountRowContent = (data: GenresCountData) => (
  <>
    <span>{data.index}</span>
    <Link href={`/games/genres/${data.id}`} className='colored'>
      {data.name}
    </Link>
    <span>{data.count}</span>
    {data.topSeries ? (
      <Link href={`/games/series/${data.topSeries.id}`} className='underline'>
        {data.topSeries.name}
      </Link>
    ) : (
      <span>—</span>
    )}
  </>
);

export default function GenresCountChart({ data }: GenresCountChartProps) {
  const doughnutData: GenresCountForDoughnut[] = data.map((value) => ({
    ...value,
    topSeries: value.topSeries?.name
  }));

  return (
    <SwitchableChart
      chartsOptions={[
        {
          chart: (
            <Chart
              chartId='genres-count'
              type='doughnut'
              defaultValueField='count'
              data={doughnutData}
              displayFields={['count', 'topSeries']}
              valueFields={['count']}
              fieldsNames={genresCountFieldsNames}
            />
          ),
          icon: <ChartPie />
        },
        {
          chart: (
            <Table
              id='genres-count-table'
              data={data}
              headers={{
                index: '№',
                name: 'Genre',
                count: 'Games',
                topSeries: 'Biggest series'
              }}
              rowContent={genresCountRowContent}
            />
          ),
          icon: <TableIcon />
        }
      ]}
    />
  );
}
