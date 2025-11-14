import ProfileContent from '@components/profile-layout/ProfileContent';
import Sidebar from '@components/profile-layout/SIdebar';

export default function ProfileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <ProfileContent>{children}</ProfileContent>
    </>
  );
}
