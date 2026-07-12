import { IgdbBasic } from '@ts/games/api-response';

export type CustomChartType = 'doughnut' | 'periodBar' | 'bar' | 'line' | 'map';

export type ChartData = IgdbBasic & {
  index: number;
  value: number;
  percent?: number;
};

export type TooltipData = ChartData
  & Record<string, string | number | undefined>;

export type TooltipProps = {
  showRank?: boolean;
  colored?: boolean;
};

export type ChartCoreProps<DataType extends ChartData> = {
  data: DataType[];
  valueField: keyof DataType;
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
