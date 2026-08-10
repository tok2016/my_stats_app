'use client';

import { SVGProps } from 'react';

import Crown from '@app/icons/Crown';
import Cup from '@app/icons/Cup';
import Medal from '@app/icons/Medal';

const rankIcons: Record<
  number,
  (props: SVGProps<SVGSVGElement>) => React.ReactNode
> = {
  0: (props) => <Crown {...props} />,
  1: (props) => <Cup {...props} />,
  2: (props) => <Medal {...props} />
};

export default function RankIcon(
  props: SVGProps<SVGSVGElement> & { rank: number }
) {
  return rankIcons[props.rank](props);
}
