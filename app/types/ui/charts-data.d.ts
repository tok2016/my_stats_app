import { ExtractTypeFields } from '@ts/util-types';

export type CustomChartType = 'doughnut' | 'periodBar' | 'bar' | 'line' | 'map';

export type ChartData = {
  id: number | string;
  name: string;
  index: number;
  percent?: number;
};

export type TooltipData = ChartData
  & Record<string, string | number | undefined>;

export type TooltipProps = {
  showRank?: boolean;
  colored?: boolean;
  enableTransition?: boolean;
};

export type ChartValueField<DataType extends ChartData> = ExtractTypeFields<
  DataType,
  number
>;

export type ChartCoreProps<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
> = {
  data: (DataType & Record<ValueKey, number>)[];
  valueField: ValueKey;
  fieldsNames: FieldsInfo<DataType>;
  tooltipProps?: TooltipProps;
};

export type ChartTypeProps = {
  doughnut?: object;
  bar?: {
    horizontal?: boolean;
  };
  line?: object;
  map?: object;
};

export type ChartType = keyof ChartTypeProps;

export type PeriodChartData<DataType extends ChartData> = {
  period: string;
  data: DataType[];
};

export type PeriodChartTransformed = ChartData & {
  countByPeriod: Record<string, number>;
};

export type DisplayFields<DataType extends ChartData> = Exclude<
  keyof DataType,
  'id' | 'name'
>[];

export type FieldData<Value extends object> = {
  name: string;
  renderKey?: (key: keyof Value, value?: Value) => React.ReactNode;
  renderValue?: (value?: Value) => React.ReactNode;
};

export type FieldsInfo<DataType extends ChartData> = Record<
  keyof DataType,
  FieldData<DataType>
>;

export type ChartContextProps<DataType extends ChartData> = {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  tooltipProps: TooltipProps;
  updateTooltip: (data: DataType) => void;
};

export type ChartValueField<DataType> = ExtractTypeFields<DataType, number>;

export type PeriodBarChartMainProps<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
> = {
  displayFields: DisplayFields<DataType>;
  fieldsNames: FieldsInfo<DataType>;
  valueField: ValueKey;
};
