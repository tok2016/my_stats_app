'use client';

import { GameTableData } from '@ts/games/game';

import Table from '@components/charts/Table';
import GameTitle from '@components/data-blocks/GameTitle';

type GamesPlaytimeTableProps = {
  data: GameTableData[];
};

/**
 * @param props
 * @param props.data - Longest played games data.
 * @returns Table of longest played games data.
 */
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
          renderRow: (value) => <GameTitle game={value} />,
          width: '3fr'
        },
        developers: {
          title: 'Developer',
          renderRow: (value) =>
            value.developers.length
              ? value.developers.map((dev) => dev.name).join(', ')
              : '—',
          width: '2fr'
        },
        publishers: {
          title: 'Publisher',
          renderRow: (value) =>
            value.publishers.length
              ? value.publishers.map((pub) => pub.name).join(', ')
              : '—',
          width: '2fr'
        },
        platform: {
          title: 'Platform',
          renderRow: (value) => (value.platform ? value.platform.name : '—'),
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
