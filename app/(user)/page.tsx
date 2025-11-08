import Link from 'next/link';

import Button from '@components/Button';
import Divider from '@components/Divider';
import UserSearch from '@components/UserSearch';

export default function Guest() {
  return (
    <div className='guest-page'>
      <h1 className='title'>
        Watch your interests evolve with <b>My_Stats</b>
      </h1>

      <div className='guest-page-form'>
        <Link href='/login'>
          <Button variant='primary'>Start</Button>
        </Link>

        <Divider>or</Divider>

        <UserSearch />
      </div>
    </div>
  );
}
