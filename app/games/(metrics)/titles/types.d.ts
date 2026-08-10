import Game, { GameCountryMetric, GameShort } from '@ts/games/game';
import { YearCountMetric } from '@ts/games/metric';
import { ChartData } from '@ts/ui/charts-data';

export type GamesPlaytimeTableData = ChartData & Game;

export type GamePeriodTopData = ChartData & GameShort;

export type GameYearChartData = ChartData
  & Omit<YearCountMetric, 'topGames'> & { topGame: string };

export type GameCountryChartData = ChartData & GameCountryMetric;
