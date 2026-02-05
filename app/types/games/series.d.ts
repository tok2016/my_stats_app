import Game from './game';
import { StudioShort } from './studio';

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
  slug: string;
  games: number[];
}

export interface ItemSeries {
  id: number;
  name: string;
  itemsMap: Map<number, CountCompareData>;
}

export default interface Series {
  id: number;
  name: string;
  slug: string;
  games: string[];
  allGames: number;
  hours: number;
  developers: number[];
  publishers: number[];
  rating?: number;
  metascore?: number;
}

export type SeriesFull = Omit<Series, 'games' | 'developers' | 'publishers'> & {
  games: Game[];
  developers: StudioShort;
  publishers: StudioShort;
};
