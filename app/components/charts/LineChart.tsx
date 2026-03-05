'use client';

import { Line } from 'react-chartjs-2';

import { ChartData, ChartProps } from '@ts/ui/charts-data';

import { useChart } from '@lib/hooks';

import ChartProvider from '@store/ChartProvider';

import { getTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

type LineChartCoreProps = {
  data: ChartData[];
  fieldsNames: Record<keyof ChartData, string>;
};

const MAX_TICKS = 20;

export function LineChartCore({ data, fieldsNames }: LineChartCoreProps) {
  const dataMap = new Map<number, ChartData>(
    data.map((value) => [value.id, value])
  );

  const { updateTooltip, tooltipRef } = useChart();

  return (
    <Line
      className={ChartClasses.line.core}
      options={{
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            grid: {
              color: 'transparent'
            },
            offset: true,
            ticks: {
              stepSize: Math.ceil(data.length / MAX_TICKS)
            },
            title: {
              text: fieldsNames.name
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            title: { text: fieldsNames.value }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: getTooltip(
            tooltipRef,
            updateTooltip,
            dataMap,
            undefined,
            'end',
            'end'
          )
        }
      }}
      data={{
        labels: data.map((value) => value.id),
        datasets: [
          {
            borderColor: '#2eacc8',
            borderWidth: 3,
            data: data.map((value) => (!value.value ? null : value.value)),
            segment: {
              borderDash: (ctx) =>
                ctx.p0.skip || ctx.p1.skip ? [6, 10] : undefined
            },
            borderCapStyle: 'round',
            spanGaps: true
          }
        ]
      }}
    />
  );
}

export default function LineChart<DataType extends ChartData>({
  data,
  displayFields,
  fieldsNames,
  chartId,
  className = ''
}: ChartProps<DataType>) {
  return (
    <ChartProvider
      chartId={chartId}
      className={`${ChartClasses.line.container} ${className}`}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
    >
      <LineChartCore data={data} fieldsNames={fieldsNames} />
    </ChartProvider>
  );
}
