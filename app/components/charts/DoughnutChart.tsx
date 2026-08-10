'use client';

import { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { ChartCoreProps, ChartData, ChartValueField } from '@ts/ui/charts-data';

import { ChartColors } from '@lib/utils';

import { ChartContext } from '@store/ChartProvider';

import { getTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

export default function DoughnutChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({ data, valueField }: ChartCoreProps<DataType, ValueKey>) {
  const dataMap = new Map(data.map((d) => [d.id, d]));

  const { updateTooltip, tooltipRef, tooltipProps } = useContext(ChartContext);

  return (
    <Doughnut
      className={ChartClasses.doughnut.core}
      options={{
        aspectRatio: 1,
        rotation: 90,
        responsive: true,
        resizeDelay: 1,
        cutout: '40%',
        elements: {
          arc: {
            spacing: 10 //global spacing doesn't work
          }
        },
        locale: 'en-US',
        plugins: {
          tooltip: getTooltip(
            tooltipRef,
            updateTooltip,
            dataMap,
            'start',
            'start',
            tooltipProps.enableTransition
          ),
          legend: {
            display: false
          }
        }
      }}
      data={{
        labels: data.map((d) => d.id),
        datasets: [
          {
            data: data.map((value) => value[valueField]),
            backgroundColor: ChartColors,
            selfJoin: true,
            normalized: true
          }
        ]
      }}
    />
  );
}
