import Link from 'next/link';

import Game from '@ts/games/game';

type StudioField = keyof Pick<Game, 'developers' | 'publishers'>;

type GameStudiosLinksProps<StudioType extends StudioField> = {
  studios: Game[StudioType];
  groupKey: string;
};

type StudioLinkProps<StudioType extends StudioField> = {
  studio: Game[StudioType][number];
  last?: boolean;
};

function StudioLink<StudioType extends StudioField>({
  studio,
  last = false
}: StudioLinkProps<StudioType>) {
  return (
    <>
      <Link href={`/games/studios/${studio.id}`} className='underline wide'>
        {studio.name}
      </Link>
      {last ? null : ', '}
    </>
  );
}

export function GameStudiosLinks<StudioType extends StudioField>({
  studios,
  groupKey
}: GameStudiosLinksProps<StudioType>) {
  return (
    <p>
      {studios.map((studio, i) => (
        <StudioLink
          key={`${groupKey}-${studio.id}`}
          studio={studio}
          last={i === studios.length - 1}
        />
      ))}
    </p>
  );
}
