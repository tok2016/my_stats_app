import ProfileContent from '@components/profile-layout/ProfileContent';
import Sidebar from '@components/profile-layout/SIdebar';
import { getUser } from '@lib/server-actions';

export default async function ProfileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <>
      <Sidebar user={user} />
      <ProfileContent>{children}</ProfileContent>
    </>
  );
}
