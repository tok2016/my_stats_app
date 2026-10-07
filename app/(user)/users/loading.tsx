import { Suspense } from 'react';

import Skeleton from '@components/Skeleton';
import UserSearch from '@components/profile-layout/UserSearch';

import UserPreviewSkeleton from '../components/UserPreviewSkeleton';

const SKELETONS_NUMBER = 3;

export default function UsersLoading() {
  return (
    <div className='users-list'>
      <div className='users-list__search'>
        <Skeleton type='h2' />
        <Suspense>
          <UserSearch id='resultsSearch' />
        </Suspense>
      </div>

      <div className='users-list__results'>
        {Array.from({ length: SKELETONS_NUMBER }).map((_, i) => (
          <UserPreviewSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
