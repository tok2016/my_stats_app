import { Option } from '@ts/ui/components-props';

import { getCountries } from '@lib/server-actions';
import SettingsForm from '@app/(user)/components/SettingsForm';
import PasswordChangeForm from '@app/(user)/components/PasswordChangeForm';
import ConfirmationProvider from '@store/ConfirmationProvider';
import DeleteAccountForm from '@app/(user)/components/delete-form/DeleteAccountForm';

const PASSWORD_POPUP_NAME = 'password';
const DELETE_POPUP_NAME = 'delete';

export default async function SettingsPage() {
  const countries = await getCountries();
  const options: Option[] = countries.data.map((country) => ({
    label: country.name,
    value: country.Iso2
  }));

  return (
    <>
      <div className='auth-layout'>
        <SettingsForm
          countriesOptions={options}
          passwordPopupName={PASSWORD_POPUP_NAME}
          deletePopupName={DELETE_POPUP_NAME}
        />
      </div>

      <ConfirmationProvider>
        <PasswordChangeForm popupName={PASSWORD_POPUP_NAME} />
        <DeleteAccountForm popupName={DELETE_POPUP_NAME} />
      </ConfirmationProvider>
    </>
  );
}
