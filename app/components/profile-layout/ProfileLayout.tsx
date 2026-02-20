import { getUser } from '@lib/server-actions';

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
    user = await getUser();
  } catch (err) {
    if (authorizedOnly) throw err;
  }

  return (
    <>
      <Sidebar user={user} authorized={!!user && !!user.id} />
      <div className='profile'>{children}</div>
    </>
  );
}
