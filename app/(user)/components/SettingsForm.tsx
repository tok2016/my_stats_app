'use client';

import { useEffect } from 'react';

import { Option } from '@ts/ui/components-props';

import Input from '@components/Input';
import Select from '@components/Select';
import Tab from '@components/Tab';
import { useUserState } from '@store/user-store';
import Button from '@components/Button';
import PublishInput from './PublishInput';
import SubmitButton from '@components/SubmitButton';
import SteamAuthInfo from './SteamAuthInfo';
import { useAction } from '@lib/hooks';
import { getServices } from '@lib/serverActions';
import AvatarInput from './AvatarInput';

type SettingsFormProps = {
  countriesOptions: Option[];
};

export default function SettingsForm({ countriesOptions }: SettingsFormProps) {
  const { user } = useUserState();
  const [services, getUserServices, isPending] = useAction(getServices, {});

  useEffect(() => {
    getUserServices();
  }, [getUserServices]);

  return (
    <form className='card settings'>
      <h2>{user.username}</h2>
      <AvatarInput avatarId={user.avatarUrl} />

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
        <PublishInput isPublicDefault={user.isPublic} />

        <a href={undefined} className='colored bold'>
          Change password
        </a>

        <a href={undefined} className='error bold'>
          Delete account
        </a>
      </Tab>

      <Tab label='Service Authentication'>
        <SteamAuthInfo serviceData={services.steam} />
      </Tab>

      <div className='buttons-flex-box'>
        <SubmitButton>Save</SubmitButton>
        <Button type='reset'>Cancel</Button>
      </div>
    </form>
  );
}
