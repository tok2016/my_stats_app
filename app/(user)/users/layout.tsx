import Logo from '@components/Logo';
import ProfileContent from '@components/profile-layout/ProfileContent';
import Sidebar from '@components/profile-layout/SIdebar';
import { getUser } from '@lib/server-actions';

export default async function UsersLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = undefined;

  try {
    user = await getUser();
  } catch {}

  return (
    <>
      <Sidebar user={user} authorized={!!user && !!user.id} />
      <ProfileContent>{children}</ProfileContent>
      <Logo variant='h1' className='top right' />
    </>
  );
}
