'use client';

import { SortDirection } from '@ts/games/filter';
import { GameTableData } from '@ts/games/game';

import { useURLSearchParams } from '@lib/hooks';

import Rating from '@components/Rating';
import Table from '@components/charts/Table';
import GameTitle from '@components/data-blocks/GameTitle';

type GamesTableProps = {
  games: GameTableData[];
  sortField?: keyof GameTableData;
  sortDirection?: SortDirection;
};

/**
 * @param props
 * @param props.games - Games to display.
 * @param props.sortField - Field that the games were sorted by.
 * @param props.sortDirection - Sort direction of games.
 * @returns Table with given games data.
 */
export default function GamesTable({
  games,
  sortField = 'index',
  sortDirection = 'asc'
}: GamesTableProps) {
  const { updateParams } = useURLSearchParams();

  /**
   * Stores field of header that was clicked and direction to search params.
   * @param field - Field to sort by.
   */
  const onSort = (field: keyof GameTableData) => {
    //If the field of clicked header is the same as given default one, toggles sort direction.
    let direction: SortDirection = 'desc';
    if (field === sortField && sortDirection === 'desc') {
      direction = 'asc';
    }

    updateParams({ sort: field, direction });
  };

  return (
    <div className='library__games-table-wrapper'>
      <Table
        id='library__games-table-wrapper__table'
        className='library__games-table-wrapper__table'
        data={games}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
        headers={{
          index: {
            title: '№',
            width: '2rem',
            renderRow: (value) => value.index + 1
          },
          name: {
            title: 'Game',
            width: '3fr',
            minWidth: '13rem',
            sort: true,
            renderRow: (value) => <GameTitle showLink game={value} />
          },
          developers: {
            title: 'Developers',
            width: '2fr',
            minWidth: '8.5rem',
            sort: true,
            renderRow: (value) =>
              value.developers.length
                ? value.developers.map((dev) => dev.name).join(', ')
                : '—'
          },
          platform: {
            title: 'Platform',
            width: '2fr',
            minWidth: '8.5rem',
            sort: true,
            renderRow: (value) => value.platform?.name ?? '—'
          },
          genres: {
            title: 'Genres',
            width: '2fr',
            minWidth: '8.5rem',
            sort: true,
            renderRow: (value) =>
              value.genres.length
                ? value.genres.map((genre) => genre.name).join(', ')
                : '—'
          },
          releasedAt: {
            title: 'Released date',
            width: '6rem',
            sort: true,
            renderRow: (value) =>
              value.releasedAt ? (
                new Date(value.releasedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              ) : (
                <span>—</span>
              )
          },
          hours: {
            title: 'Hours',
            width: '5rem',
            sort: true
          },
          rating: {
            title: 'Your rating',
            width: '5rem',
            sort: true,
            bodyCellClassName: 'table__row__cell-rating',
            renderRow: (value) => <Rating value={value.rating} />
          },
          criticsRating: {
            title: 'Critics rating',
            width: '5rem',
            sort: true,
            bodyCellClassName: 'table__row__cell-rating',
            renderRow: (value) => <Rating value={value.criticsRating} />
          },
          usersRating: {
            title: 'Users rating',
            width: '5rem',
            sort: true,
            bodyCellClassName: 'table__row__cell-rating',
            renderRow: (value) => <Rating value={value.usersRating} />
          }
        }}
      />
    </div>
  );
}
