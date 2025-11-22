import { Option } from '@ts/ui/components-props';

import { getCountries } from '@app/(user)/actions';
import SettingsForm from '@app/(user)/components/SettingsForm';

export default async function SettingsPage() {
  const countries = await getCountries();
  const options: Option[] = countries.data.map((country) => ({
    label: country.name,
    value: country.Iso2
  }));

  return (
    <div className='auth-layout'>
      <SettingsForm countriesOptions={options} />
    </div>
  );
}
