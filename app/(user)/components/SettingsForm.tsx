'use client';

import Link from 'next/link';
import { Option } from '@ts/ui/components-props';

import Input from '@components/Input';
import Select from '@components/Select';
import Tab from '@components/Tab';
import { useUserState } from '@store/user-store';
import Button from '@components/Button';
import PublishInput from './publish-controlls/PublishInput';
import SubmitButton from '@components/SubmitButton';
import AvatarInput from './avatar-editor/AvatarInput';
import ServicesSettings from './service-settings/ServicesSettings';
import { usePopupState } from '@store/popup-store';
import { useRedirectActionForm } from '@lib/hooks';
import { updateProfile } from '../actions';
import { getFormDataValue } from '@lib/utils';

type SettingsFormProps = {
  countriesOptions: Option[];
  passwordPopupName: string;
  deletePopupName: string;
};

const parseBooleanString = (value: string) =>
  !!value && value.toLowerCase() !== 'false';

export default function SettingsForm({
  countriesOptions,
  passwordPopupName,
  deletePopupName
}: SettingsFormProps) {
  const { user } = useUserState();
  const { togglePopup } = usePopupState();
  const [state, action, isPending] = useRedirectActionForm(
    updateProfile(user.id),
    '/iam'
  );

  const publicValue = getFormDataValue('isPublic');

  const onPasswordChangeOpen = () => {
    togglePopup(passwordPopupName);
  };

  const onDeleteOpen = () => {
    togglePopup(deletePopupName);
  };

  return (
    <form className='card settings' action={action} noValidate>
      <h2>{user.username}</h2>
      <AvatarInput
        avatarId={user.avatarUrl}
        defaultFile={state.data?.get('avatar') as Blob}
      />

      <Input
        type='email'
        id='email'
        name='email'
        label='Email'
        placeholder='example@email.com'
        required
        defaultValue={getFormDataValue('email', state.data) ?? user.email}
        errorHint={state.issues?.email}
      />

      <Input
        type='date'
        id='birthdate'
        name='birthdate'
        label='Birthdate'
        placeholder='01/01/2000'
        defaultValue={
          getFormDataValue('birthdate', state.data)
          ?? user.birthdate?.toString()
        }
        errorHint={state.issues?.birthdate}
      />

      <Select
        id='country'
        name='country'
        label='Country'
        variant='plain'
        options={countriesOptions}
        defaultValue={
          getFormDataValue('country', state.data) ?? (user.country || undefined)
        }
        errorHint={state.issues?.country}
      />

      <Tab label='Privacy'>
        <PublishInput
          wasPublic={user.isPublic}
          defaultValue={
            typeof publicValue === 'string'
              ? parseBooleanString(publicValue)
              : user.isPublic
          }
        />

        <a
          href={undefined}
          className='colored bold'
          onClick={onPasswordChangeOpen}
        >
          Change password
        </a>

        <a href={undefined} className='error bold' onClick={onDeleteOpen}>
          Delete account
        </a>
      </Tab>

      <ServicesSettings state={state} />

      <div className='buttons-flex-box'>
        <SubmitButton
          loading={isPending}
          reset={
            <Link href='/iam'>
              <Button type='reset' variant='outlined' disabled={isPending}>
                Cancel
              </Button>
            </Link>
          }
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
