import { PlaytimeData } from '@ts/games/metric';
import { StudioPeriodTop } from '@ts/games/studio';
import { ChartData } from '@ts/ui/charts-data';

export type StudioCountData = ChartData & PlaytimeData;

export type StudioFullPeriodTopData = ChartData & StudioPeriodTop;

export type CountryStudioChartData = ChartData & {
  count: number;
  developers: string[];
};
