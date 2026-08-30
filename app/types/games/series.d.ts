import { IgdbItemInfo } from './api-response';
import { IgdbGameRatingsStudios } from './game';

type SeriesShort = {
  title: string;
  count: number;
  hours: number;
};

type SeriesInverted = {
  title: string;
  gamesMap: Record<number, number>;
};

export interface IgdbSeries {
  id: number;
  name: string;
  games: number[];
}

export type IgdbSeriesExpanded = Omit<IgdbSeries, 'games'> & {
  games: IgdbGameRatingsStudios[];
};

export default interface Series extends IgdbItemInfo {
  allGames: number;
  developers: IgdbStudioBase[];
  publishers: IgdbStudioBase[];
}

export type SeriesCollapsed = Omit<Series, 'games'> & {
  games: string[];
};
