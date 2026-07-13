'use client';

import { IgdbBasic } from '@ts/games/api-response';
import { PeriodTopsMetric, PrecisePeriod } from '@ts/games/metric';

import PeriodTops from '@components/data-blocks/PeriodTopsMetric';

import Crown from '@app/icons/Crown';
import Cup from '@app/icons/Cup';
import Medal from '@app/icons/Medal';

const rankIcons: Record<number, React.ReactNode> = {
  0: <Crown />,
  1: <Cup />,
  2: <Medal />
};

const genreTopItemContent = (item: IgdbBasic, i: number) => {
  return (
    <>
      {rankIcons[i]}
      <span>{item.name}</span>
    </>
  );
};

const getPeriodMetric = (
  periodType?: PrecisePeriod
): Promise<PeriodTopsMetric<IgdbBasic>> => {
  const periodMetric: PeriodTopsMetric<IgdbBasic> = {
    periodType: periodType ?? 'month',
    tops: [
      {
        period: '2026-01',
        top: [
          {
            id: 5,
            name: 'Metroidvania'
          },
          {
            id: 0,
            name: 'Platformer'
          }
        ]
      },
      {
        period: '2026-02',
        top: [
          {
            id: 0,
            name: 'Platformer'
          },
          {
            id: 1,
            name: 'Third-Person Shooter'
          }
        ]
      },
      {
        period: '2026-04',
        top: [
          {
            id: 0,
            name: 'Platformer'
          },
          {
            id: 1,
            name: 'Third-Person Shooter'
          }
        ]
      },
      {
        period: '2026-05',
        top: [
          {
            id: 4,
            name: 'Turn-Based Stategy'
          },
          {
            id: 2,
            name: 'Tower Defense'
          }
        ]
      },
      {
        period: '2026-06',
        top: [
          {
            id: 0,
            name: 'Platformer'
          },
          {
            id: 3,
            name: 'Action-Adventure'
          },
          {
            id: 2,
            name: 'Tower Defense'
          }
        ]
      },
      {
        period: '2026-07',
        top: [
          {
            id: 0,
            name: 'Platformer'
          },
          {
            id: 1,
            name: 'Third-Person Shooter'
          },
          {
            id: 2,
            name: 'Tower Defense'
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
    />
  );
}
