import { IgdbBasic } from '@ts/games/api-response';

export type CustomChartType = 'doughnut' | 'periodBar' | 'bar' | 'line';

export type ChartData = IgdbBasic & { value: number };

export type TooltipData = ChartData & {
  index?: number;
  percent?: number;
} & Record<string, string | number | undefined>;

export type DoughnutData = ChartData & { percent: number };

export type PeriodChartData<DataType extends ChartData> = {
  period: string;
  data: DataType[];
};

export type PeriodChartTransformed = ChartData & {
  countByPeriod: Record<string, number>;
};

export type IndexBarChartData = ChartData & { index: number };

export type DisplayFields<DataType extends ChartData> = Exclude<
  keyof DataType,
  'id' | 'name'
>[];

export type ChartContextProps = {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  updateTooltip: (data: ChartData, index?: number, percent?: number) => void;
};

export type ChartProps<DataType extends ChartData> = {
  data: DataType[];
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  chartId: string;
  className?: string;
};
