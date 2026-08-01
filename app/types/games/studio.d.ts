import { StudioTypes } from '@lib/utils';

import { IgdbItemInfo } from './api-response';
import Game, { IgdbGameRatings } from './game';
import { IgdbGenre } from './genre';
import { IgdbImage } from './image';
import { PeriodPlaytimeData, PeriodTopsMetric, RatingData } from './metric';
import { ExternalRatings } from './rating';
import { IgdbSeries } from './series';

export type StudioType = (typeof StudioTypes)[number];

export interface IgdbInvolvedStudio {
  id: number;
  developer: boolean;
  publisher: boolean;
  company: number;
}

export interface IgdbInvolvedStuioExtended {
  id: number;
  developer: boolean;
  publisher: boolean;
  company: IgdbStudioBase;
}

export interface IgdbStudioCountry {
  id: number;
  country?: number;
}

export interface IgdbStudioBase extends IgdbStudioCountry {
  name: string;
}

export interface IgdbStudio extends IgdbStudioBase {
  logo?: IgdbImage;
  developed?: IgdbGameRatings[];
  published?: IgdbGameRatings[];
}

export type StudioShort = Omit<IgdbStudio, 'developed' | 'published' | 'logo'>
  & ExternalRatings & {
    logo?: string;
    developed: number;
    published: number;
  };

export type StudioPeriodTop = PeriodPlaytimeData & { type: StudioType };
export type StudiosPeriodMetric = PeriodTopsMetric<StudioPeriodTop>;

export interface StudioCountryMetric {
  country: number;
  gamesCount: number;
  developers: number[];
}

export type StudioRatingMetric = Omit<RatingData, 'rating'>
  & ExternalRatings & {
    averageRating?: number;
  };

export type Studio = Omit<IgdbItemInfo, 'games'> & {
  developed: Game[];
  published: Game[];
  series?: IgdbSeries[];
  topGenre?: IgdbGenre;
  country?: number;
  logo?: string;
};
