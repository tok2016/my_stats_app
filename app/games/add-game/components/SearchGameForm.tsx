'use client';

import { SearchGame, SearchGamesResults } from '@ts/games/game';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction, useURLSearchParams } from '@lib/hooks';

import Button from '@components/Button';
import Search from '@components/Search';

import BrowsedGame from './BrowsedGame';

type BrowsedGameProps = {
  game: SearchGame;
};

type SearchQuery = {
  name: string;
  page: number;
  prevGames: SearchGame[];
  prevName: string;
};

/**
 * Searches games by given name and returns the list segment by given page.
 * Adds found games to given games list, if new query equals the previous one.
 * @param query - Query data to search games by.
 * @returns Search results with segment of found games and segment (page) number.
 */
const browseGames = async (
  query?: SearchQuery
): Promise<SearchGamesResults> => {
  const searchParams = new URLSearchParams({
    query: query?.name ?? '',
    page: query?.page.toString() ?? '1'
  });

  const searchResults = await AxiosInstanse.get<SearchGamesResults>(
    `/api/games/search?${searchParams.toString()}`
  );

  //If new query is the same as previous one, adds found games to current games list.
  return {
    ...searchResults.data,
    games:
      query && query.name === query.prevName
        ? [...query.prevGames, ...searchResults.data.games]
        : searchResults.data.games
  };
};

/**
 * Preview block of browsed game. Clicking on it moves to game rating form.
 * @param props
 * @param props.game - IGDB game to preview and select.
 * @returns Preview block with browsed game data.
 */
function BrowsedGameChoice({ game }: BrowsedGameProps) {
  const { setParam } = useURLSearchParams();
  const chooseGame = (gameApiId: number) => () => {
    setParam('gameId', gameApiId.toString());
  };

  return <BrowsedGame game={game} onClick={chooseGame(game.apiId)} />;
}

/**
 * Form to browse and select a game. Has hidden pagination, so browsed games are pulled segmentally.
 * @returns Form to browse a game from IGDB by name and select it.
 */
export default function SearchGameForm() {
  const [searchResults, searchGames, isPending] = useAction(browseGames, {
    games: [],
    page: 0,
    isEnd: true,
    query: ''
  });

  /**
   * Searches IGDB by name with given query.
   * @param query
   */
  const onSearch = (query?: string) => {
    searchGames({
      prevGames: searchResults.games,
      page: 1,
      prevName: searchResults.query,
      name: query ?? ''
    });
  };

  /**
   * Loads the next page of games with query in name.
   */
  const onLoadMore = () => {
    searchGames({
      prevGames: searchResults.games,
      page: searchResults.page + 1,
      name: searchResults.query,
      prevName: searchResults.query
    });
  };

  return (
    <div className='search-game-form card'>
      <h2>Search a game</h2>

      <Search
        id='search-game'
        name='searchGame'
        placeholder='Search game'
        onSearchSubmit={onSearch}
      />

      <div
        className='browsed-games'
        style={{
          visibility: searchResults.games.length ? 'visible' : 'hidden'
        }}
      >
        {searchResults.games.map((game) => (
          <BrowsedGameChoice game={game} key={game.apiId} />
        ))}

        {/*Hides button when all found games were loaded.*/}
        {searchResults.isEnd || (
          <Button variant='secondary' onClick={onLoadMore} loading={isPending}>
            More
          </Button>
        )}
      </div>
    </div>
  );
}
