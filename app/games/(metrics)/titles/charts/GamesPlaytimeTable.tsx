'use client';

import Link from 'next/link';

import Table from '@components/charts/Table';
import GameTableTitle from '@components/data-blocks/GameTitle';

import { GameStudiosLinks } from '../components/GameStudiosLinks';
import { GamesPlaytimeTableData } from '../types';

type GamesPlaytimeTableProps = {
  data: GamesPlaytimeTableData[];
};

export default function GamesPlaytimeTable({ data }: GamesPlaytimeTableProps) {
  return (
    <Table
      id='games-playtime'
      data={data}
      headers={{
        index: {
          title: '№',
          renderRow: (value) => value.index + 1,
          width: '1.5rem'
        },
        name: {
          title: 'Game',
          renderRow: (value) => <GameTableTitle game={value} />,
          width: '3fr'
        },
        developers: {
          title: 'Developer',
          renderRow: (value) => (
            <GameStudiosLinks
              studios={value.developers}
              groupKey={`game-time-developer-${value.id}`}
            />
          ),
          width: '2fr'
        },
        publishers: {
          title: 'Publisher',
          renderRow: (value) => (
            <GameStudiosLinks
              studios={value.publishers}
              groupKey={`game-time-publisher-${value.id}`}
            />
          ),
          width: '2fr'
        },
        platform: {
          title: 'Platform',
          renderRow: (value) =>
            value.platform ? (
              <Link
                href={`/games/platforms/${value.platform.id}`}
                className='underline'
              >
                {value.platform.name}
              </Link>
            ) : (
              <span>—</span>
            ),
          width: '2fr'
        },
        hours: {
          title: 'Hours',
          width: '3rem'
        }
      }}
    />
  );
}
