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
  games: number[];
  name: string;
  slug: string;
}

export interface ItemSeries {
  id: number;
  name: string;
  itemsMap: Map<number, CountCompareData>;
}

export default interface Series {
  id: number;
  name: string;
  slig: string;
  games: string[];
  allGames: number;
  hours: number;
  developers: number[];
  publishers: number[];
  rating?: number;
  metascore?: number;
}
