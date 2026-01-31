import { RatingData } from './metric';

export interface IgdbPlatformFamily {
  id: number;
  name: string;
  slug: string;
}

export interface IgdbPlatform {
  id: number;
  name: string;
  slug: string;
  platform_family?: IgdbPlatformFamily;
  platform_logo?: number;
}

export interface PlatformRatingData extends RatingData {
  topGenre: IgdbGenre;
}
