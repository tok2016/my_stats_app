'use client';

import { ChartPie, Table as TableIcon } from '@mynaui/icons-react';

import Link from 'next/link';

import { FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

import { GenresPlaytimeData } from '../types';

type GenresPlaytimeChartProps = {
  data: GenresPlaytimeData[];
};

type GenresPlaytimeForDoughnut = Omit<GenresPlaytimeData, 'topGame'> & {
  topGame: string;
};

const playtimeFieldsNames: FieldsInfo<GenresPlaytimeForDoughnut> = {
  topGame: { name: 'Best game' },
  id: { name: 'ID' },
  hours: { name: 'Hours played' },
  count: { name: 'Games' },
  percent: { name: '%' },
  name: { name: 'Genre' },
  index: { name: '№' }
};

export default function GenresPlaytimeChart({
  data
}: GenresPlaytimeChartProps) {
  const doughnutData = data.map((value) => ({
    ...value,
    topGame: value.topGame.name
  }));

  return (
    <SwitchableChart
      className='dougnut-chart-table'
      chartsOptions={[
        {
          chart: (
            <Chart
              chartId='genres-playtime'
              type='doughnut'
              data={doughnutData}
              defaultValueField='hours'
              valueFields={['hours']}
              fieldsNames={playtimeFieldsNames}
              showLegend
              displayFields={['hours', 'topGame']}
            />
          ),
          icon: <ChartPie />
        },
        {
          chart: (
            <Table
              id='genres-playtime-table'
              data={data}
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
                      className='colored'
                    >
                      {value.name}
                    </Link>
                  )
                },
                hours: {
                  title: 'Hours',
                  width: '2fr'
                },
                topGame: {
                  title: 'Biggest game',
                  width: '5fr',
                  renderRow: (value) => (
                    <Link
                      href={`/games/series/${value.topGame.id}`}
                      className='underline'
                    >
                      {value.topGame.name}
                    </Link>
                  )
                }
              }}
            />
          ),
          icon: <TableIcon />
        }
      ]}
    />
  );
}
