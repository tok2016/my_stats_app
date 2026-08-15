import { NextRequest, NextResponse } from 'next/server';

import { SteamApiResponse } from '@ts/games/api-response';
import { GameCore, GameInSchema, IgdbGame, SteamGame } from '@ts/games/game';
import Service from '@ts/users/service';

import { getGamesByUserId } from '@lib/auth';
import { AxiosSteamInstanse } from '@lib/axios-instanse';
import { serviceEndpoint } from '@lib/endpoint-generators';
import { getImageUrl, igdbRequest } from '@lib/games/igdb';
import { GamesModel } from '@lib/models';
import { isSteamGameObject } from '@lib/type-guards';
import { MILLISECONDS, generateErrorResponse } from '@lib/utils';

type SteamGameWithId = SteamGame & { id: string };

const STEAM_IGDB_ID = 1;
const PC_ID = 6;

const updateGamesFromSteam = async (gamesFromSteam: SteamGameWithId[]) => {
  const updatePromises = gamesFromSteam.map((game) =>
    GamesModel.findByIdAndUpdate(game.id, {
      minutes: game.playtime_forever,
      playDate: new Date(game.rtime_last_played * MILLISECONDS)
    }).lean()
  );

  await Promise.all(updatePromises);
};

const uniteSteamAndIgdb = (
  steamGame: SteamGame,
  igdbGame: IgdbGame,
  userId: string
): GameInSchema => {
  return {
    userId,
    apiId: igdbGame.id,
    storeId: steamGame?.appid,
    name: igdbGame.name,
    platformId: PC_ID,
    genresIds: igdbGame.genres,
    developersIds:
      igdbGame.involved_companies
        ?.filter((company) => company.developer)
        .map((company) => company.company) ?? [],
    publishersIds:
      igdbGame.involved_companies
        ?.filter((company) => company.publisher)
        .map((company) => company.company) ?? [],
    releasedAt: igdbGame.first_release_date
      ? new Date(igdbGame.first_release_date * MILLISECONDS)
      : undefined,
    seriesId: igdbGame.collections?.reduce((prev, curr) =>
      curr.games.length > prev.games.length ? curr : prev
    ).id,
    cover: igdbGame?.cover?.image_id
      ? getImageUrl(igdbGame.cover.image_id, 'cover_big')
      : undefined,
    minutes: steamGame?.playtime_forever ?? 0,
    playDate: steamGame
      ? new Date(steamGame.rtime_last_played * MILLISECONDS)
      : undefined
  };
};

const searchGamesFromIgdb = async (
  steamGamesIds: string[]
): Promise<IgdbGame[]> => {
  const igdbGames = await igdbRequest<IgdbGame>('/games', {
    fields: [
      'name',
      'platforms',
      'involved_companies.company',
      'involved_companies.developer',
      'involved_companies.publisher',
      'first_release_date',
      'collections.games',
      'collections.name',
      'external_games.external_game_source',
      'external_games.uid',
      'genres',
      'themes',
      'cover.image_id'
    ],
    where: `external_games.uid = (${steamGamesIds.join(',')}) & external_games.external_game_source = (${STEAM_IGDB_ID})`,
    limit: steamGamesIds.length
  });

  return igdbGames.map((igdbGame) => ({
    ...igdbGame,
    external_games: igdbGame.external_games?.filter(
      (game) => game.external_game_source === STEAM_IGDB_ID
    )
  }));
};

const addGameFromSteam = async (steamGames: SteamGame[], userId: string) => {
  const steamGamesMap: Record<number, SteamGame> = Object.fromEntries(
    steamGames.map((steamGame) => [steamGame.appid, steamGame])
  );

  const igdbGames = await searchGamesFromIgdb(Object.keys(steamGamesMap));
  const gamesToAdd = igdbGames.map((igdbGame) => {
    const steamAppId = parseInt(igdbGame.external_games?.[0].uid ?? '0');
    return uniteSteamAndIgdb(steamGamesMap[steamAppId], igdbGame, userId);
  });

  await GamesModel.create(gamesToAdd);
};

const pullGamesFromSteam = async (_req: NextRequest, service?: Service) => {
  if (!service) throw generateErrorResponse(401, `Steam ID wasn't provided`);

  const searchParams = new URLSearchParams({
    key: process.env.STEAM_KEY ?? '',
    steamid: service?.login ?? '',
    include_appinfo: 'true',
    include_played_free_games: 'true',
    format: 'json'
  });

  const steamResponse = await AxiosSteamInstanse.get<SteamApiResponse<unknown>>(
    `/IPlayerService/GetOwnedGames/v0001?${searchParams.toString()}`
  );

  if (!isSteamGameObject(steamResponse.data.response))
    throw generateErrorResponse(401, 'Profile is private');

  const savedGames = await getGamesByUserId(service.userId);
  const savedGamesEntries = savedGames
    .filter((game) => !!game.storeId)
    .map((game) => [game.storeId, game]);
  const gamesMap: Record<string, GameCore> =
    Object.fromEntries(savedGamesEntries);

  const gamesToUpdate: SteamGameWithId[] = [];
  const gamesToAdd: SteamGame[] = [];

  steamResponse.data.response.games.forEach((game) => {
    const gameCore = gamesMap[game.appid];
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
export const DELETE = async () => {
  await GamesModel.deleteMany();

  return new NextResponse('All games data was deleted', {
    status: 200
  });
};
