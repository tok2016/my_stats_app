'use client';

import { ReactNode, useMemo, useState } from 'react';

import {
  ChartData,
  ChartType,
  ChartTypeProps,
  DisplayFields,
  TooltipProps
} from '@ts/ui/charts-data';
import { Option } from '@ts/ui/components-props';

import ChartProvider from '@store/ChartProvider';

import Select from '@components/Select';

import BarChart from './BarChart';
import ChartLegend from './ChartLegend';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import { ChartClasses } from './chart-styles';

type ChartComponentProps<
  CurrentChartType extends ChartType,
  DataType extends ChartData
> = {
  type: CurrentChartType;
  chartId: string;
  data: DataType[];
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  valueFields?: (keyof DataType)[];
  className?: string;
  showLegend?: boolean;
  tooltipProps?: TooltipProps;
  props?: ChartTypeProps[CurrentChartType];
};

const TooltipPropsByType: Record<ChartType, TooltipProps> = {
  doughnut: {
    showRank: true,
    colored: true
  },
  bar: {
    showRank: true,
    colored: true
  },
  line: {
    showRank: false,
    colored: false
  }
};

const getChartCore = <
  CurrentChartType extends ChartType,
  DataType extends ChartData
>(
  data: DataType[],
  valueField: keyof DataType,
  fieldsNames: Record<keyof DataType, string>,
  props?: ChartTypeProps[CurrentChartType]
): Record<ChartType, ReactNode> => ({
  doughnut: (
    <DoughnutChart
      data={data}
      valueField={valueField}
      fieldsNames={fieldsNames}
      {...props}
    />
  ),
  bar: (
    <BarChart
      data={data}
      valueField={valueField}
      fieldsNames={fieldsNames}
      {...props}
    />
  ),
  line: (
    <LineChart
      data={data}
      valueField={valueField}
      fieldsNames={fieldsNames}
      {...props}
    />
  )
});

export default function Chart<
  CurrentChartType extends ChartType,
  DataType extends ChartData
>({
  type,
  chartId,
  data,
  displayFields,
  fieldsNames,
  valueFields,
  className = '',
  showLegend: showLabel,
  tooltipProps,
  props
}: ChartComponentProps<CurrentChartType, DataType>) {
  const [valueField, setValueField] = useState<keyof DataType>(
    valueFields?.[0] ?? 'value'
  );

  const onFieldSelect = (newValue: string) => {
    const newKey = newValue as keyof DataType;
    setValueField((currValue) => (!fieldsNames[newKey] ? currValue : newKey));
  };

  const options: Option[] = useMemo(
    () =>
      valueFields?.map((field) => ({
        label: fieldsNames[field],
        value: field.toString(),
        key: field.toString()
      })) ?? [],
    [fieldsNames, valueFields]
  );

  const percentMap = useMemo(
    () => new Map(data.map((d) => [d.id, d.percent])),
    [data]
  );

  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
      tooltipProps={tooltipProps ?? TooltipPropsByType[type]}
      className={`${ChartClasses[type].container} ${className}`}
    >
      {options.length > 1 && (
        <Select
          variant='text'
          id={`${chartId}-select`}
          name={`${chartId}-select`}
          defaultValue={valueField.toString()}
          options={options}
          onSelect={onFieldSelect}
        />
      )}

      <div className='chart-legend-content'>
        <div className='chart-core-wrapper'>
          {getChartCore(data, valueField, fieldsNames, props)[type]}
        </div>

        {showLabel && <ChartLegend data={data} percentsMap={percentMap} />}
      </div>
    </ChartProvider>
  );
}
