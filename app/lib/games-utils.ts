import { GameCore } from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';
import { IgdbStudio, Studio } from '@ts/games/studio';

import { igdbRequest } from './igdb';

export const getGenres = async (games: GameCore[]) => {
  const genresIds = new Set<number>();
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresIds.add(genre);
    });
  });

  const genres = await igdbRequest<IgdbGenre>('/genres', {
    fields: ['name', 'slug'],
    where: `id = (${genresIds.values().toArray().join(',')})`,
    limit: genresIds.size
  });

  const genresMap: Record<number, IgdbGenre> = Object.fromEntries(
    genres.map((genre) => [genre.id, genre])
  );

  return genresMap;
};

export const getStudios = async (games: GameCore[]) => {
  const studiosIds = new Set<number>();

  games.forEach((game) => {
    const gameStudios = [...game.developersIds, ...game.publishersIds];
    gameStudios.forEach((studio) => {
      studiosIds.add(studio);
    });
  });

  const studios = await igdbRequest<IgdbStudio>('/companies', {
    fields: ['name', 'slug', 'country', 'developed', 'published', 'logo'],
    where: `id = (${studiosIds.values().toArray().join(',')})`,
    limit: studiosIds.size
  });

  const studiosMap: Record<number, Studio> = Object.fromEntries(
    studios.map((studio) => [
      studio.id,
      {
        ...studio,
        developed: studio.developed?.length ?? 0,
        published: studio.published?.length ?? 0
      }
    ])
  );

  return studiosMap;
};
