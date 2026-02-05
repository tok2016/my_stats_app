import { IgdbBasic, IgdbItemInfo } from './api-response';
import { IgdbGenre } from './genre';
import { IgdbImage } from './image';
import { RatingData } from './metric';
import { IgdbSeries } from './series';

export interface IgdbPlatformFamily {
  id: number;
  name: string;
  slug: string;
}

export interface IgdbPlatform extends IgdbBasic {
  platform_family?: IgdbPlatformFamily;
  platform_logo?: IgdbImage;
}

export interface PlatformRatingData extends RatingData {
  topGenre: IgdbGenre;
}

export default interface Platform extends IgdbItemInfo {
  topGenre?: IgdbGenre;
  topSeries?: IgdbSeries;
  family?: IgdbPlatformFamily;
  logo?: string;
}
