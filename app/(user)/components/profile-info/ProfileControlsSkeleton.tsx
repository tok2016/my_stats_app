import Link from 'next/link';

import IconButton from '@components/IconButton';
import { Lock, Share, Wrench } from '@mynaui/icons-react';

export default function ProfileControlsSkeleton() {
  return (
    <div className='profile-controlls'>
      <IconButton icon={<Lock />} loading />

      <IconButton icon={<Share />} loading />

      <Link href='/iam/settings'>
        <IconButton icon={<Wrench />} />
      </Link>
    </div>
  );
}
