'use client';

import { PeriodTopsMetric, PrecisePeriod } from '@ts/games/metric';
import { ChartData } from '@ts/ui/charts-data';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';
import RankIcon from '@components/data-blocks/RankIcon';

type PeriodChartData = ChartData & { hours: number };

const genreTopItemContent = (item: PeriodChartData, i: number) => {
  return (
    <>
      <RankIcon rank={i} />
      <span>{item.name}</span>
    </>
  );
};

const getPeriodMetric = (
  periodType?: PrecisePeriod
): Promise<PeriodTopsMetric<PeriodChartData>> => {
  const periodMetric: PeriodTopsMetric<PeriodChartData> = {
    periodType: periodType ?? 'month',
    tops: [
      {
        period: '2025-10',
        top: [
          {
            id: 2,
            name: 'Tower Defense',
            index: 0,
            hours: 10
          },
          {
            id: 6,
            name: 'Strategy',
            index: 1,
            hours: 10
          }
        ]
      },
      {
        period: '2025-11',
        top: [
          {
            id: 2,
            name: 'Tower Defense',
            index: 0,
            hours: 12
          },
          {
            id: 6,
            name: 'Strategy',
            index: 1,
            hours: 12
          },
          {
            id: 7,
            name: 'RPG',
            index: 2,
            hours: 7
          }
        ]
      },
      {
        period: '2025-12',
        top: [
          {
            id: 1,
            name: 'Third-Person Shooter',
            index: 3,
            hours: 10
          },
          {
            id: 5,
            name: 'Metroidvania',
            index: 4,
            hours: 4
          },
          {
            id: 0,
            name: 'Platformer',
            index: 5,
            hours: 4
          }
        ]
      },
      {
        period: '2026-1',
        top: [
          {
            id: 0,
            name: 'Platformer',
            index: 0,
            hours: 30
          },
          {
            id: 5,
            name: 'Metroidvania',
            index: 1,
            hours: 16
          },
          {
            id: 1,
            name: 'Third-Person Shooter',
            index: 2,
            hours: 14
          }
        ]
      },
      {
        period: '2026-2',
        top: [
          {
            id: 0,
            name: 'Platformer',
            index: 0,
            hours: 13
          },
          {
            id: 1,
            name: 'Third-Person Shooter',
            index: 2,
            hours: 13
          }
        ]
      },
      {
        period: '2026-4',
        top: [
          {
            id: 0,
            name: 'Platformer',
            index: 0,
            hours: 6
          },
          {
            id: 1,
            name: 'Third-Person Shooter',
            index: 2,
            hours: 6
          }
        ]
      },
      {
        period: '2026-5',
        top: [
          {
            id: 4,
            name: 'Turn-Based Stategy',
            index: 3,
            hours: 15
          },
          {
            id: 2,
            name: 'Tower Defense',
            index: 4,
            hours: 14
          }
        ]
      },
      {
        period: '2026-6',
        top: [
          {
            id: 0,
            name: 'Platformer',
            index: 0,
            hours: 23
          },
          {
            id: 3,
            name: 'Action-Adventure',
            index: 5,
            hours: 23
          },
          {
            id: 2,
            name: 'Tower Defense',
            index: 4,
            hours: 10
          }
        ]
      },
      {
        period: '2026-7',
        top: [
          {
            id: 0,
            name: 'Platformer',
            index: 0,
            hours: 23
          },
          {
            id: 1,
            name: 'Third-Person Shooter',
            index: 2,
            hours: 23
          },
          {
            id: 2,
            name: 'Tower Defense',
            index: 4,
            hours: 2
          }
        ]
      }
    ]
  };

  return Promise.resolve(periodMetric);
};

export default function PeriodTopPage() {
  return (
    <PeriodTops
      id='test-genre'
      title='Your most played genres'
      listItemContent={genreTopItemContent}
      getPeriodMetric={getPeriodMetric}
      showBar
      displayFields={['hours']}
      valueField='hours'
      fieldsNames={{
        id: { name: 'ID' },
        hours: { name: 'Hours played' },
        index: { name: '№' },
        percent: { name: '%' },
        name: { name: 'Genre' }
      }}
    />
  );
}
