import Logo from '@components/Logo';
import '@styles/user-pages.scss';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='user'>
      <Logo className='top left' />
      {children}
    </div>
  );
}
