'use client';

import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { ChartProps, IndexBarChartData } from '@ts/ui/charts-data';
import { Option } from '@ts/ui/components-props';

import { useChart } from '@lib/hooks';
import { ChartColors } from '@lib/utils';

import ChartProvider from '@store/ChartProvider';

import Select from '@components/Select';

import { getTooltip } from './ChartTooltip';
import { barElements, xBarAxis, yBarLineAxis } from './chart-styles';

type BarChartProps<DataType extends IndexBarChartData> =
  ChartProps<DataType> & {
    horizontal?: boolean;
    valueFields: (keyof DataType)[];
  };

type BarChartCoreProps<DataType extends IndexBarChartData> = {
  data: DataType[];
  valueField: keyof DataType;
  horizontal?: boolean;
};

Chart.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

function BarChartCore<DataType extends IndexBarChartData>({
  data,
  valueField,
  horizontal = false
}: BarChartCoreProps<DataType>) {
  const valueData: IndexBarChartData[] = [];
  const dataMap = new Map<number, IndexBarChartData>();
  const indexMap = new Map<number, number>();

  data.forEach((value) => {
    const newValue = value[valueField];
    const updatedData = { ...value };
    if (typeof newValue === 'number') updatedData.value = newValue;

    valueData.push(updatedData);
    dataMap.set(updatedData.id, updatedData);
    indexMap.set(updatedData.id, updatedData.index);
  });

  const { updateTooltip, tooltipRef } = useChart();

  return (
    <Bar
      className={`bar-chart ${horizontal ? 'horizontal' : ''}`}
      options={{
        aspectRatio: 1.2,
        elements: {
          bar: {
            borderRadius: !horizontal
              ? barElements?.bar?.borderRadius
              : {
                  topRight: 4,
                  bottomRight: 4
                }
          }
        },
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        layout: {
          padding: 20
        },
        scales: {
          y: {
            ...xBarAxis(
              '',
              valueData.map((value) => value.name)
            ),
            ticks: {
              display: false
            },
            title: {
              display: false
            },
            offset: true
          },
          x: {
            ...yBarLineAxis(''),
            ticks: {
              ...yBarLineAxis('')?.ticks,
              padding: -8
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: getTooltip(tooltipRef, updateTooltip, dataMap, indexMap)
        }
      }}
      data={{
        labels: valueData.map((value) => value.name),
        datasets: [
          {
            backgroundColor: ChartColors,
            data: valueData.map((value) => value.value),
            categoryPercentage: 0.5
          }
        ]
      }}
    />
  );
}

export default function BarChart<DataType extends IndexBarChartData>({
  data,
  displayFields,
  fieldsNames,
  chartId,
  valueFields,
  horizontal = false,
  className
}: BarChartProps<DataType>) {
  const fieldsOptions: Option[] = valueFields.map((field) => ({
    label: fieldsNames[field],
    value: field.toString(),
    key: field.toString()
  }));

  const [field, setField] = useState<keyof DataType>(valueFields[0] ?? 'value');

  const onFieldSelect = (value: string) => {
    const newField = value as keyof DataType;
    if (!!fieldsNames[newField]) setField(newField);
  };

  return (
    <ChartProvider
      className={`period-chart ${className}`}
      chartId={chartId}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
    >
      <Select
        variant='text'
        name={`${chartId}-field`}
        id={`${chartId}-field`}
        options={fieldsOptions}
        onSelect={onFieldSelect}
      />
      <BarChartCore data={data} valueField={field} horizontal={horizontal} />
    </ChartProvider>
  );
}
