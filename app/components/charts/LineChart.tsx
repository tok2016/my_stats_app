'use client';

import {
  Chart,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { ChartData, ChartProps } from '@ts/ui/charts-data';

import { useChart } from '@lib/hooks';

import ChartProvider from '@store/ChartProvider';

import { getTooltip } from './ChartTooltip';
import { xLinearAxis, yLinearAxis } from './chart-styles';

Chart.register(LineElement, Tooltip, LinearScale, PointElement);

type LineChartCoreProps = {
  data: ChartData[];
  fieldsNames: Record<keyof ChartData, string>;
};

const MAX_TICKS = 20;

function LineChartCore({ data, fieldsNames }: LineChartCoreProps) {
  const dataMap = new Map<number, ChartData>(
    data.map((value) => [value.id, value])
  );

  const { updateTooltip, tooltipRef } = useChart();

  return (
    <Line
      className='line-chart'
      options={{
        responsive: true,
        aspectRatio: 4,
        elements: {
          point: {
            radius: 6,
            backgroundColor: '#2eacc8',
            hoverRadius: 12
          }
        },
        scales: {
          x: {
            ...xLinearAxis(fieldsNames.name),
            grid: {
              display: false
            },
            offset: true,
            ticks: {
              ...(xLinearAxis(fieldsNames.name)?.ticks ?? {}),
              stepSize: Math.ceil(data.length / MAX_TICKS)
            }
          },
          y: { ...yLinearAxis(fieldsNames.value), beginAtZero: true }
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
      className={className}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
    >
      <LineChartCore data={data} fieldsNames={fieldsNames} />
    </ChartProvider>
  );
}
