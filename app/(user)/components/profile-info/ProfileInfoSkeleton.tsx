import Logo from '@components/Logo';
import Avatar from '@components/profile-layout/Avatar';

import ProfileControlsSkeleton from './ProfileControlsSkeleton';
import ProfileCreditsSkeleton from './ProfileCreditsSkeleton';

type ProfileInfoSkeletonProps = {
  authorized?: boolean;
};

export default function ProfileInfoSkeleton({
  authorized = false
}: ProfileInfoSkeletonProps) {
  return (
    <div className='profile-info'>
      <Avatar username='' loading />
      <ProfileCreditsSkeleton />

      <div className='profile-meta'>
        <Logo />
        {!authorized || <ProfileControlsSkeleton />}
      </div>
    </div>
  );
}
