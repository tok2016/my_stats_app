import { Lock, Share, Wrench } from '@mynaui/icons-react';

import Link from 'next/link';

import IconButton from '@components/IconButton';

export default function ProfileControlsSkeleton() {
  return (
    <div className='profile-info__meta__controlls'>
      <IconButton icon={<Lock />} loading />

      <IconButton icon={<Share />} loading />

      <Link href='/iam/settings'>
        <IconButton icon={<Wrench />} />
      </Link>
    </div>
  );
}
