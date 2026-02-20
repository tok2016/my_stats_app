import ProfileLayout from '@components/profile-layout/ProfileLayout';

import '@styles/games-pages.scss';

export default function GamesLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='games'>
      <ProfileLayout authorizedOnly>{children}</ProfileLayout>
    </div>
  );
}
