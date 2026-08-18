import Skeleton from '@components/Skeleton';
import GameCollageSkeleton from '@components/data-blocks/GameCollageSkeleton';
import PropBlock from '@components/data-blocks/PropBlock';

type RecommendedGameSkeletonProps = {
  parentKey: string;
};

export default function RecommendedGameSkeleton({
  parentKey
}: RecommendedGameSkeletonProps) {
  return (
    <div className='data-block recommended-game'>
      <Skeleton type='h4' />

      <GameCollageSkeleton parentKey={parentKey} />

      <PropBlock title='Genres'>
        <Skeleton type='text' fontSize='small' />
      </PropBlock>

      <PropBlock title='Available at'>
        <Skeleton type='text' fontSize='small' />
      </PropBlock>
    </div>
  );
}
