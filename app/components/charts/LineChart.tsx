'use client';

import { Line } from 'react-chartjs-2';

import { ChartCoreProps, ChartData } from '@ts/ui/charts-data';

import { useChart } from '@lib/hooks';

import { getTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

const MAX_TICKS = 20;

export default function LineChart<DataType extends ChartData>({
  data,
  valueField,
  fieldsNames
}: ChartCoreProps<DataType>) {
  const dataMap = new Map<number, ChartData>(
    data.map((value) => [value.id, value])
  );

  const { updateTooltip, tooltipRef } = useChart();

  const values = data.map((d) => {
    const value =
      !d[valueField] || typeof d[valueField] === 'number'
        ? d[valueField]
        : d.value;
    return !value ? null : value;
  });

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
          tooltip: getTooltip(tooltipRef, updateTooltip, dataMap, 'end', 'end')
        }
      }}
      data={{
        labels: data.map((value) => value.id),
        datasets: [
          {
            borderColor: '#2eacc8',
            borderWidth: 3,
            data: values,
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
