import { NextRequest, NextResponse } from 'next/server';

import { RawgApiListResponse, SteamApiResponse } from '@ts/games/api-response';
import Service from '@ts/users/service';
import {
  GameCore,
  GameInSchema,
  RawgGame,
  RawgGameShort,
  SteamGame
} from '@ts/games/game';

import { AxiosRawgInstanse, AxiosSteamInstanse } from '@lib/axios-instanse';
import {
  generateErrorResponse,
  isSteamGameObject,
  MILLISECONDS
} from '@lib/utils';
import { getGamesByUserId } from '@lib/auth';
import { GamesModel } from '@lib/models';
import { serviceEndpoint } from '@lib/endpoint-generators';

type SteamGameWithId = SteamGame & { id: string };

const updateGamesFromSteam = async (gamesFromSteam: SteamGameWithId[]) => {
  const updatePromises = gamesFromSteam.map((game) =>
    GamesModel.findByIdAndUpdate(game.id, {
      minutes: game.playtime_forever,
      playDate: new Date(game.rtime_last_played * MILLISECONDS)
    }).lean()
  );

  await Promise.all(updatePromises);
};

const uniteSteamAndRawg = (
  userId: string,
  steamGame?: SteamGame,
  rawgGame?: RawgGame
): GameInSchema | undefined =>
  !rawgGame
    ? undefined
    : {
        userId,
        name: rawgGame.name,
        apiId: rawgGame.id,
        platformId: '4',
        genresIds: rawgGame.genres.map((genre) => genre.id),
        tagsIds: rawgGame.tags
          .filter((tag) => tag.language === 'eng')
          .map((tag) => tag.id),
        developersIds: rawgGame.developers.map((developer) => developer.id),
        publishersIds: rawgGame.publishers.map((publisher) => publisher.id),
        esrbRatingId: rawgGame.esrb_rating?.id,
        releasedAt: rawgGame.released ? new Date(rawgGame.released) : undefined,
        image: rawgGame.background_image,
        metascore: rawgGame.metacritic,
        minutes: steamGame?.playtime_forever ?? 0,
        playDate: steamGame
          ? new Date(steamGame.rtime_last_played * MILLISECONDS)
          : undefined
      };

const searchGameFromRawg = async (userId: string, steamGame: SteamGame) => {
  const searchParams = new URLSearchParams();
  searchParams.set('key', process.env.RAWG_KEY ?? '');
  searchParams.set('search_exact', 'true');
  searchParams.set('platforms', '4');
  searchParams.set('exclude_collection', 'true');
  searchParams.set('exclude_additions', 'true');
  searchParams.set('stores', '1');
  searchParams.set('page_size', '10');
  searchParams.set('search', steamGame.name);

  const searchResult = await AxiosRawgInstanse.get<
    RawgApiListResponse<RawgGameShort>
  >(`/games?${searchParams.toString()}`);

  const rawgGameShort = searchResult.data.results.find(
    (search) => search.name === steamGame.name
  );

  if (!rawgGameShort) return undefined;
  const rawgGame = await AxiosRawgInstanse.get<RawgGame>(
    `/games/${rawgGameShort.id}?${searchParams.toString()}`
  );

  return uniteSteamAndRawg(userId, steamGame, rawgGame.data);
};

const addGameFromSteam = async (
  gamesFromSteam: SteamGame[],
  userId: string
) => {
  const searchResults = gamesFromSteam.map((game) => {
    return searchGameFromRawg(userId, game);
  });

  const gamesToAdd = (await Promise.all(searchResults)).filter(
    (game) => !!game
  );

  await GamesModel.create(gamesToAdd);
};

const pullGamesFromSteam = async (_req: NextRequest, service?: Service) => {
  if (!service) throw generateErrorResponse(401, `Steam ID wasn't provided`);

  const searchParams = new URLSearchParams();
  searchParams.set('key', process.env.STEAM_KEY ?? '');
  searchParams.set('steamid', service?.login ?? '');
  searchParams.set('include_appinfo', 'true');
  searchParams.set('include_played_free_games', 'true');
  searchParams.set('format', 'json');

  const steamResponse = await AxiosSteamInstanse.get<SteamApiResponse<unknown>>(
    `/IPlayerService/GetOwnedGames/v0001?${searchParams.toString()}`
  );

  if (!isSteamGameObject(steamResponse.data.response))
    throw generateErrorResponse(401, 'Profile is private');

  const gamesList = steamResponse.data.response.games
    .slice()
    .sort((a, b) => a.appid - b.appid);

  const savedGames = await getGamesByUserId(service.userId);
  const savedGamesEntries = savedGames.map((game) => [game.name, game]);
  const gamesMap: Record<string, GameCore> =
    Object.fromEntries(savedGamesEntries);

  const gamesToUpdate: SteamGameWithId[] = [];
  const gamesToAdd: SteamGame[] = [];

  gamesList.forEach((game) => {
    const gameCore = gamesMap[game.name];
    if (!gameCore) gamesToAdd.push(game);
    else if (gameCore.minutes !== game.playtime_forever)
      gamesToUpdate.push({ ...game, id: gameCore.id });
  });

  await updateGamesFromSteam(gamesToUpdate);
  await addGameFromSteam(gamesToAdd, service.userId);

  return new NextResponse('Games data from Steam were pulled successfully', {
    status: 201,
    statusText: 'Games data from Steam were pulled successfully'
  });
};

export const POST = serviceEndpoint(pullGamesFromSteam);
