import Game from '@ts/games/game';
import { CountData, PlaytimeData } from '@ts/games/metric';
import { ChartData } from '@ts/ui/charts-data';

export type GenresCountData = ChartData
  & Omit<CountData, 'topSeries'> & {
    topSeries?: Game['series'];
  };

export type GenresPlaytimeData = ChartData & PlaytimeData;
