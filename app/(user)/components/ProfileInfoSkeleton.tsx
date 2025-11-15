import Skeleton from '@components/Skeleton';
import CountryDataSkeleton from './CountryDataSkeleton';

const SKELETON_WIDTH = '10rem';

export default function ProfileInfoSkeleton() {
  return (
    <div className='profile-credits'>
      <Skeleton type='h2' width={SKELETON_WIDTH} />

      <div className='profile-details'>
        <Skeleton type='h3' width={SKELETON_WIDTH} />
        <Skeleton type='text' width={SKELETON_WIDTH} />

        <CountryDataSkeleton />
      </div>
    </div>
  );
}
