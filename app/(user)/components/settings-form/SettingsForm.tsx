'use client';

import Link from 'next/link';

import { Option } from '@ts/ui/components-props';

import Input from '@components/Input';
import Tab from '@components/Tab';
import { useUserState } from '@store/user-store';
import Button from '@components/Button';
import PublishInput from '../publish-controlls/PublishInput';
import SubmitButton from '@components/SubmitButton';
import AvatarInput from '../avatar-editor/AvatarInput';
import ServicesSettings from '../service-settings/ServicesSettings';
import { usePopupState } from '@store/popup-store';
import { useRedirectActionForm } from '@lib/hooks';
import { updateProfile } from '../../actions';
import {
  defaultFormState,
  getFormDataValue,
  parseBooleanString
} from '@lib/utils';
import SearchSelect from '@components/SearchSelect';
import SettingsFormSkeleton from './SettingsFormSkeleton';

type SettingsFormProps = {
  countriesOptions: Option[];
  passwordPopupName: string;
  deletePopupName: string;
};

const getDataValue = (date?: string | Date) => {
  if (!date) return '';

  const dateObject = new Date(date);
  const year = dateObject.getFullYear().toString();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  return [year, month, day].join('-');
};

export default function SettingsForm({
  countriesOptions,
  passwordPopupName,
  deletePopupName
}: SettingsFormProps) {
  const { user, status } = useUserState();
  const { togglePopup } = usePopupState();
  const [state, action, isPending] = useRedirectActionForm(
    updateProfile(user.id),
    '/iam',
    defaultFormState(),
    true
  );

  const publicValue = getFormDataValue('isPublic', state.data);

  const onPasswordChangeOpen = () => {
    togglePopup(passwordPopupName);
  };

  const onDeleteOpen = () => {
    togglePopup(deletePopupName);
  };

  if (status === 'pending') return <SettingsFormSkeleton />;

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
        defaultValue={getDataValue(
          getFormDataValue('birthdate', state.data)
            ?? user.birthdate?.toString()
        )}
        errorHint={state.issues?.birthdate}
      />

      <SearchSelect
        id='country'
        name='country'
        label='Country'
        options={countriesOptions}
        defaultValue={
          getFormDataValue('country', state.data) ?? user.country?.toString()
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

      <ServicesSettings state={state} userId={user.id} />

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
    </form>
  );
}
