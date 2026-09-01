import { Suspense } from 'react';

import { getUserSet } from '@lib/server-actions';

import Sidebar from './SIdebar';

export default async function ProfileLayout({
  authorizedOnly = true,
  children
}: {
  authorizedOnly?: boolean;
  children: React.ReactNode;
}) {
  let user = undefined;

  try {
    user = await getUserSet();
  } catch (err) {
    if (authorizedOnly) throw err;
  }

  return (
    <>
      <Suspense>
        <Sidebar user={user} authorized={!!user && !!user.id} />
      </Suspense>
      <div className='profile'>{children}</div>
    </>
  );
}
