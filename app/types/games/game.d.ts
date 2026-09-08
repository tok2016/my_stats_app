import { ChartData } from '@ts/ui/charts-data';

import ObjectMapArray from '@lib/object-map-array';

import { IgdbBasic } from './api-response';
import { IgdbGenre } from './genre';
import { IgdbImage } from './image';
import { IgdbPlatform, PlatformShort } from './platform';
import { ExternalRatings, Ratings } from './rating';
import { IgdbSeries } from './series';
import {
  IgdbInvolvedStudio,
  IgdbInvolvedStuioExtended,
  IgdbStudioBase
} from './studio';

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  rtime_last_played: number;
  playtime_disconnected: number;
}

export interface SteamGamesList {
  game_count: number;
  games: SteamGame[];
}

export interface IgdbGameSearch extends IgdbBasic {
  cover?: IgdbImage;
  platfroms: IgdbBasic[];
  genres: IgdbGenre[];
  first_release_date?: number;
}

export interface IgdbGame extends IgdbBasic {
  genres: number[];
  platforms: number[];
  themes: number[];
  collections?: IgdbSeries[];
  first_release_date?: number;
  involved_companies?: IgdbInvolvedStudio[];
  cover?: IgdbImage;
  external_games?: {
    id: number;
    uid: string;
    external_game_source: number;
  }[];
}

export type IgdbRecommendedGame = Pick<IgdbGame, 'id' | 'name' | 'cover'> & {
  external_games: {
    id: number;
    url?: string;
    external_game_source: {
      id: number;
      name: string;
    };
    game_release_format?: number;
  }[];
  genres: {
    id: number;
    name: string;
  }[];
  screenshots?: {
    image_id: string;
  }[];
  rating?: number;
};

export interface IgdbGameTag extends IgdbBasic {
  tags: number[];
}

export interface GameUpdate {
  hours: number;
  rating?: number;
  playDate?: string;
  platformId: number;
}

export interface NewGame extends GameUpdate {
  apiId: number;
  storeId?: number;
  name: string;
  genresIds: number[];
  developersIds: number[];
  publishersIds: number[];
  seriesId?: number;
  releasedAt?: string;
  coverId?: string;
}

export interface GameInSchema extends NewGame {
  userId: string;
}

export interface GameCore extends GameInSchema {
  id: string;
}

export type GameShort = Pick<GameCore, 'id' | 'apiId' | 'name' | 'rating'> & {
  hours: number;
  coverUrl?: string;
};

export interface IgdbGameFull extends IgdbBasic {
  first_release_date?: number;
  cover?: IgdbImage;
  screenshots?: IgdbImage[];
  genres: IgdbGenre[];
  platforms: IgdbPlatform[];
  collections?: IgdbSeries[];
  involved_companies?: IgdbInvolvedStuioExtended[];
  aggregated_rating?: number;
  rating?: number;
}

export interface SearchGame {
  apiId: number;
  name: string;
  genres: IgdbGenre[];
  platforms: IgdbBasic[];
  developers: IgdbStudioBase[];
  publishers: IgdbStudioBase[];
  releasedAt?: string;
  cover?: {
    url: string;
    id: string;
  };
  series?: IgdbSeries;
}

export interface SearchGamesResults {
  games: SearchGame[];
  page: number;
  query: string;
  isEnd: boolean;
}

export default interface Game extends ExternalRatings {
  id: string;
  name: string;
  apiId: number;
  genres: IgdbGenre[];
  platform?: PlatformShort;
  developers: IgdbStudioBase[];
  publishers: IgdbStudioBase[];
  series?: IgdbSeries;
  coverUrl?: string;
  screenshots?: string[];
  hours: number;
  releasedAt?: string;
  rating?: number;
  playDate?: string;
}

export type RecommendedGame = IgdbBasic & {
  coverUrl?: string;
  external: {
    id: number;
    url?: string;
    source?: {
      id: number;
      name: string;
    };
  }[];
  genres: IgdbBasic[];
  screenshots?: string[];
  rating?: number;
};

export type GameDetailed = Omit<
  Game,
  'rating' | 'criticsRating' | 'usersRating' | 'hours'
>
  & Ratings & {
    themes: IgdbBasic[];
    platforms: IgdbBasic[];
    similarGames: RecommendedGame[];
  };

export interface GameCountryMetric {
  country: number;
  name: string;
  count: number;
  hours: number;
  topGames: GameShort[];
}

export type IgdbGameRatings = Pick<
  IgdbGameFull,
  'id' | 'aggregated_rating' | 'rating'
>;

export type IgdbGameRatingsStudios = IgdbGameRatings & {
  involved_companies?: IgdbInvolvedStuioExtended[];
};

export type GameTableData = ChartData & Game;

export type GamesTablePage = {
  games: ObjectMapArray<Game, 'id'>;
  startIndex: number;
  currentPage: number;
  pagesCount: number;
  maxHours: number;
};

export type GamesTablePageResponse = Omit<GamesTablePage, 'games'> & {
  games: Game[];
};
