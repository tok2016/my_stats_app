import ProfileControlsSkeleton from './ProfileControlsSkeleton';
import ProfileCreditsSkeleton from './ProfileCreditsSkeleton';
import Avatar from '@components/profile-layout/Avatar';

type ProfileInfoSkeletonProps = {
  authorized?: boolean;
};

export default function ProfileInfoSkeleton({
  authorized = false
}: ProfileInfoSkeletonProps) {
  return (
    <div className='profile-info'>
      <Avatar loading />
      <ProfileCreditsSkeleton />

      <div className='profile-meta'>
        <h1>My_Stats</h1>
        {!authorized || <ProfileControlsSkeleton />}
      </div>
    </div>
  );
}
