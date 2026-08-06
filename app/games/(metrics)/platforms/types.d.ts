import Game from '@ts/games/game';
import { CountData, PeriodPlaytimeData, PlaytimeData } from '@ts/games/metric';
import { ChartData } from '@ts/ui/charts-data';

export type PlatformCountChartData = ChartData
  & Omit<CountData, 'topSeries'> & {
    topSeries?: Game['series'];
  };

export type PlatformPlaytimeChartData = ChartData & PlaytimeData;

export type PlatformPeriodPlaytimeData = ChartData
  & PeriodPlaytimeData & { logo?: string };
