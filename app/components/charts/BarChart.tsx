'use client';

import { Chart } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { ChartCoreProps, ChartData } from '@ts/ui/charts-data';

import { useChart } from '@lib/hooks';
import { ChartColors } from '@lib/utils';

import { getTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

type BarChartCoreProps<DataType extends ChartData> =
  ChartCoreProps<DataType> & {
    horizontal?: boolean;
  };

type ChartScaleType = NonNullable<Chart['options']['scales']>[string];

export default function BarChart<DataType extends ChartData>({
  data,
  valueField,
  horizontal = false
}: BarChartCoreProps<DataType>) {
  const dataMap = new Map<number, DataType>(data.map((d) => [d.id, d]));

  const { updateTooltip, tooltipRef } = useChart();

  const xAxis: ChartScaleType = {
    type: 'category',
    labels: data.map((value) => value.name),
    ticks: {
      display: false
    },
    title: {
      display: false
    },
    offset: true
  };

  const yAxis: ChartScaleType = {
    type: 'linear',
    title: {
      display: false
    }
  };

  return (
    <Bar
      className={`${ChartClasses.bar.core} ${horizontal ? 'horizontal' : ''}`}
      options={{
        maintainAspectRatio: false,
        layout: {
          padding: 10
        },
        elements: {
          bar: {
            borderRadius: !horizontal
              ? undefined
              : {
                  topRight: 4,
                  bottomRight: 4
                }
          }
        },
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        scales: {
          y: horizontal ? xAxis : yAxis,
          x: horizontal ? yAxis : xAxis
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: getTooltip(tooltipRef, updateTooltip, dataMap)
        }
      }}
      data={{
        labels: data.map((value) => value.name),
        datasets: [
          {
            backgroundColor: ChartColors,
            data: data.map((value) =>
              typeof value[valueField] === 'number'
                ? value[valueField]
                : value.value
            ),
            categoryPercentage: 0.5
          }
        ]
      }}
    />
  );
}
