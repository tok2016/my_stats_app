'use client';

import { ChartPieSolid, TableSolid } from '@mynaui/icons-react';

import { FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

import { PlatformCountChartData } from '../types';

type PlatformsCountChartProps = {
  data: PlatformCountChartData[];
};

type PlatformsCountDataForChart = Omit<PlatformCountChartData, 'topSeries'> & {
  topSeries?: string;
};

const fieldsNames: FieldsInfo<PlatformsCountDataForChart> = {
  id: { name: 'ID' },
  name: { name: 'Platform' },
  count: { name: 'Games' },
  index: { name: '№' },
  topSeries: { name: 'Best series' },
  percent: { name: '%' }
};

export default function PlatformsCountChart({
  data
}: PlatformsCountChartProps) {
  const chartData = data.map((value) => ({
    ...value,
    topSeries: value.topSeries?.name
  }));

  return (
    <SwitchableChart
      chartsOptions={[
        {
          chart: (
            <Chart
              chartId='platforms-count-chart'
              type='doughnut'
              data={chartData}
              displayFields={['count', 'topSeries']}
              valueFields={['count']}
              defaultValueField='count'
              fieldsNames={fieldsNames}
              showLegend
            />
          ),
          icon: <ChartPieSolid />
        },
        {
          chart: (
            <Table
              id='platforms-count-table'
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
                count: {
                  title: 'Games',
                  width: '2fr'
                },
                topSeries: {
                  title: 'Biggest series',
                  width: '5fr',
                  renderRow: (value) =>
                    value.topSeries ? value.topSeries.name : '—'
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
