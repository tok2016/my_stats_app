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
}

export interface SeriesCompareData {
  count: number;
  minutes: number;
}

export interface ItemSeries {
  id: number;
  name: string;
  itemsMap: Map<number, SeriesCompareData>;
}
