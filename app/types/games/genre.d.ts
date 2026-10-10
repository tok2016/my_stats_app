import { IgdbBasic, IgdbItemInfo } from './api-response';
import { GameShort } from './game';
import { IgdbSeries } from './series';

export type IgdbGenre = IgdbBasic;

export type GenreTop = {
  id: number;
  topGames: GameShort[];
};

export default interface Genre extends IgdbItemInfo {
  topSeries?: IgdbSeries;
}
