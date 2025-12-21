import Avatar from '@components/profile-layout/Avatar';
import Skeleton from '@components/Skeleton';

export default function UserPreviewSkeleton() {
  return (
    <div className='user-preview'>
      <Avatar loading />

      <div className='user-credits'>
        <Skeleton type='h3' />
        <Skeleton type='h4' />
        <Skeleton type='text' />
      </div>
    </div>
  );
}
