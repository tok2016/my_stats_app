export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='user'>{children}</div>;
}
