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
  fieldsInfo: FieldsInfo<DataType>;
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

/**
 * @param data - Data to visualize.
 * @param valueField - Fields of data which values will be used to build the chart elements. Accept only number fields.
 * @param fieldsInfo - Fields render data with names for tooltip and chart.
 * @param props - Chart props specific to type.
 * @returns Core chart component by type.
 */
const getChartCore = <
  CurrentChartType extends ChartType,
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>(
  data: (DataType & Record<ValueKey, number>)[],
  valueField: ValueKey,
  fieldsInfo: FieldsInfo<DataType>,
  props?: ChartTypeProps[CurrentChartType]
): Record<ChartType, ReactNode> => ({
  doughnut: (
    <DoughnutChart
      data={data}
      valueField={valueField}
      fieldsInfo={fieldsInfo}
      {...props}
    />
  ),
  bar: (
    <BarChart
      data={data}
      valueField={valueField}
      fieldsInfo={fieldsInfo}
      {...props}
    />
  ),
  line: (
    <LineChart
      data={data}
      valueField={valueField}
      fieldsInfo={fieldsInfo}
      {...props}
    />
  ),
  map: (
    <MapChart
      data={data}
      valueField={valueField}
      fieldsInfo={fieldsInfo}
      {...props}
    />
  )
});

/**
 * Renders chart with single dataset by type. Serves as a wrapper for rendered chart with legend, tooltip and value fields select.
 * @param props
 * @param props.type - Chart type: doughnut / bar / line / map / etc.
 * @param props.chartId - Id of chart component.
 * @param props.data - Data to visualize.
 * @param props.displayFields - Fields data to display on tooltip.
 * @param props.fieldsInfo - Fields render data with names that for tooltip and chart.
 * @param props.valueFields - Fields of data which values will be used to build the chart elements. Accept only number fields.
 * If multiple fields are given, renders select to choose one of the fields.
 * @param props.defaultValueField - Default field in values fields select.
 * @param props.className - Class of chart container.
 * @param props.showLegend - If true, displays legend of chart data.
 * @param props.tooltipProps - Tooltip component props.
 * @param props.props - Props specific to given chart type.
 * @returns Chart of given type.
 */
export default function Chart<
  CurrentChartType extends ChartType,
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  type,
  chartId,
  data,
  displayFields,
  fieldsInfo,
  valueFields,
  defaultValueField,
  className = '',
  showLegend,
  tooltipProps,
  props
}: ChartComponentProps<CurrentChartType, DataType, ValueKey>) {
  const [valueField, setValueField] = useState<ValueKey>(
    valueFields?.[0] ?? defaultValueField
  );

  const onFieldSelect = (newValue: string) => {
    const newKey = newValue as ValueKey;
    setValueField((currValue) => (!fieldsInfo[newKey] ? currValue : newKey));
  };

  const options: Option[] = useMemo(
    () =>
      valueFields?.map((field) => ({
        label: fieldsInfo[field].name,
        value: field.toString(),
        key: field.toString()
      })) ?? [],
    [fieldsInfo, valueFields]
  );

  const percentMap = useMemo(
    () => new Map(data.map((d) => [d.id, d.percent])),
    [data]
  );

  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsInfo={fieldsInfo}
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
          {getChartCore(data, valueField, fieldsInfo, props)[type]}
        </div>

        {showLegend && <ChartLegend data={data} percentsMap={percentMap} />}
      </div>
    </ChartProvider>
  );
}
