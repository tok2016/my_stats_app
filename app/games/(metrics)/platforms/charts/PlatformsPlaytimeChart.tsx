'use client';

import { ChartPieSolid, TableSolid } from '@mynaui/icons-react';

import { FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

import { PlatformPlaytimeChartData } from '../types';

type PlatformsPlaytimeChartProps = {
  data: PlatformPlaytimeChartData[];
};

type PlatformPlaytimeForChart = Omit<PlatformPlaytimeChartData, 'topGame'> & {
  topGame: string;
};

const fieldsNames: FieldsInfo<PlatformPlaytimeForChart> = {
  id: { name: 'ID' },
  index: { name: '№' },
  name: { name: 'Platform' },
  percent: { name: '%' },
  topGame: { name: 'Best game' },
  count: { name: 'Games' },
  hours: { name: 'Hours played' }
};

export default function PlatformsPlaytimeChart({
  data
}: PlatformsPlaytimeChartProps) {
  const chartData: PlatformPlaytimeForChart[] = data.map((value) => ({
    ...value,
    topGame: value.topGame.name
  }));

  return (
    <SwitchableChart
      chartsOptions={[
        {
          chart: (
            <Chart
              chartId='platforms-playtime-chart'
              type='doughnut'
              data={chartData}
              displayFields={['hours', 'topGame']}
              valueFields={['hours']}
              defaultValueField='hours'
              fieldsNames={fieldsNames}
              showLegend
            />
          ),
          icon: <ChartPieSolid />
        },
        {
          chart: (
            <Table
              id='platforms-playtime-table'
              data={data}
              headers={{
                index: {
                  title: '№',
                  width: '1.5rem',
                  renderRow: (value) => value.index + 1
                },
                name: {
                  title: 'Platform',
                  width: '5fr',
                  renderRow: (value) => (
                    <span className='colored'>{value.name}</span>
                  )
                },
                hours: {
                  title: 'Hours',
                  width: '2fr'
                },
                topGame: {
                  title: 'Biggest game',
                  width: '5fr',
                  renderRow: (value) => value.topGame.name
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
