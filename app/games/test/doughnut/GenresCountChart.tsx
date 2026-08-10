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
  seriesName: { name: 'Best series' }
};

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
              valueFields={['count']}
              defaultValueField='count'
              showLegend
            />
          ),
          icon: <ChartPieTwoSolid />
        },
        {
          chart: (
            <Table
              key='genres-count-table'
              data={data.filter((genre) => !!genre.id)}
              headers={{
                index: {
                  title: '№',
                  width: '1rem',
                  renderRow: (value) => value.index + 1
                },
                name: {
                  title: 'Genre',
                  width: '5fr',
                  renderRow: (value) => (
                    <Link
                      href={`/games/genres/${value.id}`}
                      className='bold colored'
                    >
                      {value.name}
                    </Link>
                  )
                },
                count: {
                  title: 'Games',
                  width: '2fr'
                },
                seriesName: {
                  title: 'Biggest Series',
                  width: '5fr',
                  renderRow: (value) =>
                    value.seriesName ? (
                      <Link
                        href={`/games/series/${value.seriesName}`}
                        className='underline'
                      >
                        {value.seriesName}
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
