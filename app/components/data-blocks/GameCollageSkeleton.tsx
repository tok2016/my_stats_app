import Skeleton from '@components/Skeleton';

import { SCREENSHOTS_IN_COLLAGE } from './GameCollage';

type GameCollageSkeletonProps = {
  parentKey: string;
};

export default function GameCollageSkeleton({
  parentKey
}: GameCollageSkeletonProps) {
  return (
    <div className='game-collage'>
      <Skeleton type='image' className='game-cover' />

      {Array.from({ length: SCREENSHOTS_IN_COLLAGE }).map((_, i) => (
        <Skeleton
          key={`${parentKey}-screenshot-${i}`}
          type='image'
          className={`screenshot screenshot-${i + 1}`}
        />
      ))}
    </div>
  );
}
