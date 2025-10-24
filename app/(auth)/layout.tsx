import '@styles/user-pages.scss';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='user auth-layout'>
      <h1 className='auth-header'>My_Stats</h1>
      {children}
    </div>
  );
}
