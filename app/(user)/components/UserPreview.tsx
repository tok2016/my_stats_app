import Link from 'next/link';

import { BasicUser } from '@ts/users/user';
import Country from '@ts/users/country';

import Avatar from '@components/profile-layout/Avatar';
import CountryData from './country/CountryData';

type UserPreviewProps = {
  user: BasicUser;
  country?: Country;
};

export default function UserPreview({ user, country }: UserPreviewProps) {
  return (
    <Link href={`/users/${user.id}`} className='user-preview'>
      <Avatar avatarId={user.avatarUrl} />

      <div className='user-credits'>
        <h3>{user.username}</h3>
        <h4>{user.email}</h4>
        {!country || <CountryData country={country} />}
      </div>
    </Link>
  );
}
