'use client';

import { GameTableData } from '@ts/games/game';

import Table from '@components/charts/Table';
import GameTableTitle from '@components/data-blocks/GameTitle';

type GamesPlaytimeTableProps = {
  data: GameTableData[];
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
