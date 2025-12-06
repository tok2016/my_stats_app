'use client';

import { useEffect } from 'react';

import FormState from '@ts/ui/form-state';
import { ServicesLogins } from '@ts/users/service';

import Tab from '@components/Tab';
import SteamAuthInfo from './SteamAuthInfo';
import { useAction } from '@lib/hooks';
import { getServices } from '@lib/server-actions';
import { getFormDataValue } from '@lib/utils';

type ServicesSettingsProps = {
  state: FormState<ServicesLogins>;
};

export default function ServicesSettings({ state }: ServicesSettingsProps) {
  const [services, getUserServices, isPending] = useAction(getServices, {});

  useEffect(() => {
    getUserServices();
  }, [getUserServices]);

  return (
    <Tab label='Service Authentication' loading={isPending}>
      <SteamAuthInfo
        serviceData={services.steam}
        defaultValue={
          getFormDataValue('steam', state.data) ?? services.steam?.name
        }
        errorHint={state.issues?.steam}
      />
    </Tab>
  );
}
