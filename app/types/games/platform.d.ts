import { IgdbBasic, IgdbItemInfo } from './api-response';
import { IgdbGenre } from './genre';
import { IgdbImage } from './image';
import { RatingData } from './metric';
import { IgdbSeries } from './series';

export interface IgdbPlatform extends IgdbBasic {
  platform_family?: IgdbBasic;
  platform_logo?: IgdbImage;
}

export interface PlatformRatingData extends RatingData {
  topGenre: number;
}

export interface PlatformShort extends IgdbBasic {
  family?: IgdbBasic;
  logo?: string;
}

export default interface Platform extends IgdbItemInfo, PlatformShort {
  topGenre?: IgdbGenre;
  topSeries?: IgdbSeries;
}
