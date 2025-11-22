'use client';

import { Option } from '@ts/ui/components-props';

import BinaryInput from '@components/BinaryInput';
import Input from '@components/Input';
import Avatar from '@components/profile-layout/Avatar';
import Select from '@components/Select';
import Tab from '@components/Tab';
import { useUserState } from '@store/user-store';
import Button from '@components/Button';

type SettingsFormProps = {
  countriesOptions: Option[];
};

export default function SettingsForm({ countriesOptions }: SettingsFormProps) {
  const { user } = useUserState();

  return (
    <form className='card settings'>
      <h2>{user.username}</h2>
      <Avatar avatarId={user.avatarUrl} />

      <Input
        type='email'
        id='email'
        name='email'
        label='Email'
        placeholder='example@email.com'
        required
      />

      <Input
        type='date'
        id='birthdate'
        name='birthdate'
        label='Birthdate'
        placeholder='01/01/2000'
      />

      <Select
        id='country'
        name='country'
        label='Country'
        variant='plain'
        options={countriesOptions}
      />

      <Tab label='Privacy'>
        <BinaryInput
          type='checkbox'
          id='isPublic'
          name='isPublic'
          label='Public'
          isSwitch
        />

        <a href={undefined} className='colored bold'>
          Change password
        </a>

        <a href={undefined} className='error bold'>
          Delete account
        </a>
      </Tab>

      <Button>Save</Button>
    </form>
  );
}
