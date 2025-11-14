export default function ProfileContent({
  children
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <div className='profile'>{children}</div>;
}
