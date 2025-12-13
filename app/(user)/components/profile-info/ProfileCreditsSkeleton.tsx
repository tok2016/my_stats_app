import Skeleton from '@components/Skeleton';
import CountryDataSkeleton from '../country/CountryDataSkeleton';

const SKELETON_WIDTH = '10rem';

export default function ProfileCreditsSkeleton() {
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
