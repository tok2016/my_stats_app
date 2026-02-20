import { IgdbBasic } from '@ts/games/api-response';

export type ChartData = IgdbBasic & Record<string, string | number | undefined>;

export type DoughnutData = ChartData & { percent: number };

export type PeriodChartData<DataType extends ChartData> = {
  period: string;
  data: DataType[];
};
