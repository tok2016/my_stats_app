import { PeriodTop, PrecisePeriod } from '@ts/games/metric';
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

export type FieldData = {
  name: string;
  keyComponent?: React.ReactNode;
};

export type FieldsInfo<DataType extends ChartData> = Record<
  keyof DataType,
  FieldData
>;

export type ChartContextProps = {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  updateTooltip: (data: ChartData) => void;
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
