'use client';

import { Chart } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { ChartCoreProps, ChartData, ChartValueField } from '@ts/ui/charts-data';

import { useChart } from '@lib/hooks';
import { ChartColors } from '@lib/utils';

import { setTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

type BarChartCoreProps<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
> = ChartCoreProps<DataType, ValueKey> & {
  horizontal?: boolean;
};

type ChartScaleType = NonNullable<Chart['options']['scales']>[string];

/**
 * @param props
 * @param props.data - Chart data to visualize.
 * @param props.valueField - Field of data which values will be used to build the chart elements. Accept only number fields.
 * @param props.horizontal - Are bars horizontal.
 * @returns Bar chart.
 */
export default function BarChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  data,
  valueField,
  horizontal = false
}: BarChartCoreProps<DataType, ValueKey>) {
  const dataMap = new Map<number | string, DataType>(
    data.map((d) => [d.id, d])
  );

  const { updateTooltip, tooltipRef, tooltipProps } = useChart();

  //X axis of vertical bar chart.
  const xAxis: ChartScaleType = {
    type: 'category',
    labels: data.map((value) => value.id.toString()),
    ticks: {
      display: false
    },
    title: {
      display: false
    },
    offset: true
  };

  //Y axis of vertical bar chart.
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
          tooltip: setTooltip(
            tooltipRef,
            updateTooltip,
            dataMap,
            'start',
            'start',
            tooltipProps.enableTransition
          )
        }
      }}
      data={{
        labels: data.map((value) => value.id),
        datasets: [
          {
            backgroundColor: ChartColors,
            data: data.map((value) => value[valueField]),
            categoryPercentage: 0.5
          }
        ]
      }}
    />
  );
}
