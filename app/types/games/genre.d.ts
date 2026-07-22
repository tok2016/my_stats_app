import { IgdbBasic, IgdbItemInfo } from './api-response';
import { IgdbSeries } from './series';

export type IgdbGenre = IgdbBasic;

export type GenreTop = {
  id: number;
  topGames: string[];
};

export default interface Genre extends IgdbItemInfo {
  topSeries?: IgdbSeries;
}
