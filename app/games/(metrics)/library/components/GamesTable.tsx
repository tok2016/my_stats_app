'use client';

import { SortDirection } from '@ts/games/filter';
import { GameTableData } from '@ts/games/game';

import { useURLSearchParams } from '@lib/hooks';

import Rating from '@components/Rating';
import Table from '@components/charts/Table';
import GameTableTitle from '@components/data-blocks/GameTitle';
import { LinksString } from '@components/data-blocks/LinksString';

type GamesTableProps = {
  games: GameTableData[];
  sortField?: keyof GameTableData;
  sortDirection?: SortDirection;
};

export default function GamesTable({
  games,
  sortField = 'index',
  sortDirection = 'asc'
}: GamesTableProps) {
  const { updateParams } = useURLSearchParams();
  const onSort = (field: keyof GameTableData) => {
    let direction: SortDirection = 'desc';
    if (field === sortField && sortDirection === 'desc') {
      direction = 'asc';
    }

    updateParams({ sort: field, direction });
  };

  return (
    <div className='games-library-wrapper'>
      <Table
        id='games-library'
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
            renderRow: (value) => <GameTableTitle game={value} />
          },
          developers: {
            title: 'Developers',
            width: '2fr',
            renderRow: (value) => (
              <LinksString
                items={value.developers}
                groupKey={`${value.id}-developers`}
                baseEndpoint='/games/studios'
              />
            )
          },
          platform: {
            title: 'Platform',
            width: '2fr',
            renderRow: (value) =>
              value.platform ? (
                <a
                  href={`/games/platforms/${value.platform}`}
                  className='underline'
                >
                  {value.platform.name}
                </a>
              ) : (
                <span>—</span>
              )
          },
          genres: {
            title: 'Genres',
            width: '2fr',
            renderRow: (value) => (
              <LinksString
                items={value.genres}
                groupKey={`${value.id}-genres`}
                baseEndpoint='/games/genres'
              />
            )
          },
          releasedAt: {
            title: 'Released date',
            width: '6rem',
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
            width: '4rem'
          },
          rating: {
            title: 'Your rating',
            width: '4.5rem',
            renderRow: (value) => (
              <Rating value={value.rating} className='table-rating' />
            )
          },
          criticsRating: {
            title: 'Critics rating',
            width: '4.5rem',
            renderRow: (value) => (
              <Rating value={value.criticsRating} className='table-rating' />
            )
          },
          usersRating: {
            title: 'Users rating',
            width: '4.5rem',
            renderRow: (value) => (
              <Rating value={value.usersRating} className='table-rating' />
            )
          }
        }}
      />
    </div>
  );
}
