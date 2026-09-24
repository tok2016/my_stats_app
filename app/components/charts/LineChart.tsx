'use client';

import { Line } from 'react-chartjs-2';

import { ChartCoreProps, ChartData, ChartValueField } from '@ts/ui/charts-data';

import { useChart } from '@lib/hooks';

import { setTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

const MAX_TICKS = 20;

/**
 * @param props
 * @param props.data - Chart data to visualize.
 * @param props.valueField - Field of data which values will be used to build the chart elements. Accept only number fields.
 * @param props.fieldsInfo - Fields render data with names for tooltip and chart.
 * @returns Line chart. Connects dots with empty value in between with dash line.
 */
export default function LineChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({ data, valueField, fieldsInfo }: ChartCoreProps<DataType, ValueKey>) {
  const dataMap = new Map<number | string, ChartData>(
    data.map((value) => [value.id, value])
  );

  const { updateTooltip, tooltipRef, tooltipProps } = useChart();

  //Does not let render 0 values with dots.
  //They're considered as empty values, so the line will ignore them and connect previous full data with the next one.
  const values = data.map((d) => (!d[valueField] ? null : d[valueField]));

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
              text: fieldsInfo.name.name
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            title: { text: fieldsInfo[valueField].name }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: setTooltip(
            tooltipRef,
            updateTooltip,
            dataMap,
            'end',
            'end',
            tooltipProps.enableTransition
          )
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
