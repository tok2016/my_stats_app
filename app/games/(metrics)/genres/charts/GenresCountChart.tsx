'use client';

import { ChartPieSolid, TableSolid } from '@mynaui/icons-react';

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

export default function GenresCountChart({ data }: GenresCountChartProps) {
  const doughnutData: GenresCountForDoughnut[] = data.map((value) => ({
    ...value,
    topSeries: value.topSeries?.name
  }));

  return (
    <SwitchableChart
      className='dougnut-chart-table'
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
              showLegend
              fieldsNames={genresCountFieldsNames}
            />
          ),
          icon: <ChartPieSolid />
        },
        {
          chart: (
            <Table
              id='genres-count-table'
              data={data}
              headers={{
                index: {
                  title: '№',
                  width: '1.5rem',
                  renderRow: (value) => value.index + 1
                },
                name: {
                  title: 'Genre',
                  width: '5fr',
                  renderRow: (value) => (
                    <Link
                      href={`/games/genres/${value.id}`}
                      className='colored'
                    >
                      {value.name}
                    </Link>
                  )
                },
                count: {
                  title: 'Games',
                  width: '2fr'
                },
                topSeries: {
                  title: 'Biggest series',
                  width: '5fr',
                  renderRow: (value) =>
                    value.topSeries ? (
                      <Link
                        href={`/games/series/${value.topSeries.id}`}
                        className='underline'
                      >
                        {value.topSeries.name}
                      </Link>
                    ) : (
                      <span>—</span>
                    )
                }
              }}
            />
          ),
          icon: <TableSolid />
        }
      ]}
    />
  );
}
