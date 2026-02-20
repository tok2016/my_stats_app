import ProfileLayout from '@components/profile-layout/ProfileLayout';

export default function UserProfileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProfileLayout authorizedOnly>{children}</ProfileLayout>;
}
