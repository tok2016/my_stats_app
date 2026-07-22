import Link from 'next/link';

import Button from '@components/Button';
import Input from '@components/Input';
import SearchSelect from '@components/SearchSelect';
import Skeleton from '@components/Skeleton';
import Tab from '@components/Tab';
import Avatar from '@components/profile-layout/Avatar';

export default function SettingsFormSkeleton() {
  return (
    <div className='card settings'>
      <Skeleton type='h2' />

      <div className='avatar-field'>
        <Avatar username='' loading />
      </div>

      <Input
        type='email'
        id='email'
        name='email'
        label='Email'
        placeholder='example@email.com'
        required
        disabled
      />

      <Input
        type='date'
        id='birthdate'
        name='birthdate'
        label='Birthdate'
        placeholder='01/01/2000'
        disabled
      />

      <SearchSelect
        id='country'
        name='country'
        label='Country'
        disabled
        options={[]}
      />

      <Tab label='Privacy' loading>
        <></>
      </Tab>

      <Tab label='Service Authentication' loading>
        <></>
      </Tab>

      <div className='buttons-flex-box'>
        <Button disabled>Submit</Button>

        <Link href='/iam'>
          <Button type='reset' variant='outlined'>
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
