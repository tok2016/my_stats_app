import { ItemCompareData, PeriodTopsMetric } from './metric';

export interface IgdbInvolvedStudio {
  id: number;
  developer: boolean;
  publisher: boolean;
  company: number;
}

export interface IgdbStudioCountry {
  id: number;
  country?: number;
}

export interface IgdbStudio extends IgdbStudioCountry {
  name: string;
  slug: string;
  logo?: number;
  developed?: number[];
  published?: number[];
}

export type Studio = Omit<IgdbStudio, 'developed' | 'published'> & {
  developed: number;
  published: number;
};

export interface StudiosPeriodTop {
  developers?: (string | number)[];
  publishers?: (string | number)[];
}

export type StudiosPeriodMetric = Pick<PeriodTopsMetric<void>, 'periodType'> & {
  tops: (StudiosPeriodTop & { period: string })[];
};

export interface StudioCountryMetric {
  country: number;
  developer?: ItemCompareData;
  publisher?: ItemCompareData;
}
