'use client';

import { ReactNode, useMemo, useState } from 'react';

import {
  ChartData,
  ChartType,
  ChartTypeProps,
  ChartValueField,
  DisplayFields,
  FieldsInfo,
  TooltipProps
} from '@ts/ui/charts-data';
import { Option } from '@ts/ui/components-props';

import ChartProvider from '@store/ChartProvider';

import Select from '@components/Select';

import BarChart from './BarChart';
import ChartLegend from './ChartLegend';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import MapChart from './MapChart';
import { ChartClasses } from './chart-styles';

type ChartComponentProps<
  CurrentChartType extends ChartType,
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
> = {
  type: CurrentChartType;
  chartId: string;
  data: (DataType & Record<ValueKey, number>)[];
  displayFields: DisplayFields<DataType>;
  fieldsNames: FieldsInfo<DataType>;
  valueFields?: ValueKey[];
  defaultValueField: ValueKey;
  className?: string;
  showLegend?: boolean;
  tooltipProps?: TooltipProps;
  props?: ChartTypeProps[CurrentChartType];
};

const TooltipPropsByType: Record<ChartType, TooltipProps> = {
  doughnut: {
    showRank: true,
    colored: true,
    enableTransition: true
  },
  bar: {
    showRank: true,
    colored: true,
    enableTransition: true
  },
  line: {
    showRank: false,
    colored: false,
    enableTransition: true
  },
  map: {
    showRank: true,
    colored: true,
    enableTransition: true
  }
};

const getChartCore = <
  CurrentChartType extends ChartType,
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>(
  data: (DataType & Record<ValueKey, number>)[],
  valueField: ValueKey,
  fieldsNames: FieldsInfo<DataType>,
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
  ),
  map: (
    <MapChart
      data={data}
      valueField={valueField}
      fieldsNames={fieldsNames}
      {...props}
    />
  )
});

export default function Chart<
  CurrentChartType extends ChartType,
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  type,
  chartId,
  data,
  displayFields,
  fieldsNames,
  valueFields,
  defaultValueField,
  className = '',
  showLegend: showLabel,
  tooltipProps,
  props
}: ChartComponentProps<CurrentChartType, DataType, ValueKey>) {
  const [valueField, setValueField] = useState<ValueKey>(
    valueFields?.[0] ?? defaultValueField
  );

  const onFieldSelect = (newValue: string) => {
    const newKey = newValue as ValueKey;
    setValueField((currValue) => (!fieldsNames[newKey] ? currValue : newKey));
  };

  const options: Option[] = useMemo(
    () =>
      valueFields?.map((field) => ({
        label: fieldsNames[field].name,
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
