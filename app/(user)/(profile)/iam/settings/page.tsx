import { Option } from '@ts/ui/components-props';

import { getCountriesList } from '@lib/server-actions';

import ConfirmationProvider from '@store/ConfirmationProvider';

import PasswordChangeForm from '@app/(user)/components/PasswordChangeForm';
import DeleteAccountForm from '@app/(user)/components/delete-form/DeleteAccountForm';
import SettingsForm from '@app/(user)/components/settings-form/SettingsForm';

const PASSWORD_POPUP_NAME = 'password';
const DELETE_POPUP_NAME = 'delete';

const EmptyCountry: Option = {
  label: '-',
  value: '-',
  key: '-'
};

/**
 * @returns Page with user's settings form.
 */
export default async function SettingsPage() {
  //Forms countries options.
  const countries = await getCountriesList();
  const options: Option[] = countries.map((country) => ({
    label: country.name,
    value: country.Iso2,
    key: country.Iso2
  }));

  return (
    <>
      <SettingsForm
        countriesOptions={[EmptyCountry, ...options]}
        passwordPopupName={PASSWORD_POPUP_NAME}
        deletePopupName={DELETE_POPUP_NAME}
      />

      <ConfirmationProvider>
        <PasswordChangeForm popupName={PASSWORD_POPUP_NAME} />
        <DeleteAccountForm popupName={DELETE_POPUP_NAME} />
      </ConfirmationProvider>
    </>
  );
}
