import { Suspense } from 'react';

import { getCurrentUser } from '@lib/server-actions';

import Sidebar from './SIdebar';

/**
 * @param props
 * @param props.authorizedOnly - Is profile only for authorized user. If true and user is unauthorized, throws an error.
 * @param props.children - Profile content.
 * @returns Layout of user's profile with sidebar.
 */
export default async function ProfileLayout({
  authorizedOnly = true,
  children
}: {
  authorizedOnly?: boolean;
  children: React.ReactNode;
}) {
  let user = undefined;

  try {
    user = await getCurrentUser();
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
