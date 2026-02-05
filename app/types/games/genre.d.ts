import { IgdbBasic, IgdbItemInfo } from './api-response';
import { IgdbSeries } from './series';

export type IgdbGenre = IgdbBasic;

export default interface Genre extends IgdbItemInfo {
  topSeries?: IgdbSeries;
}
