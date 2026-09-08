import Logo from '@components/Logo';
import ProfileLayout from '@components/profile-layout/ProfileLayout';

export default function UsersLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProfileLayout authorizedOnly={false}>{children}</ProfileLayout>

      <Logo variant='h1' className='top right' />
    </>
  );
}
