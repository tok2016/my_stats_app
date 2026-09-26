'use client';

import { useEffect } from 'react';

import FormState from '@ts/ui/form-state';
import { ServicesLogins } from '@ts/users/service';

import { useAction } from '@lib/hooks';
import { getServicesByUserId } from '@lib/server-actions';
import { getFormDataValue } from '@lib/utils';

import Tab from '@components/Tab';

import SteamAuthInfo from './SteamAuthInfo';

type ServicesSettingsProps = {
  userId: string;
  state: FormState<ServicesLogins>;
};

/**
 * @param props
 * @param props.userId - User id to fetch service credentials by.
 * @param props.state - Form state.
 * @returns Tab of services settings.
 */
export default function ServicesSettings({
  userId,
  state
}: ServicesSettingsProps) {
  const [services, getUserServices, isPending] = useAction(
    getServicesByUserId,
    {}
  );

  useEffect(() => {
    getUserServices(userId);
  }, [getUserServices, userId]);

  return (
    <Tab label='Service Authentication' loading={isPending}>
      <SteamAuthInfo
        serviceData={services.steam}
        defaultValue={
          getFormDataValue('steam', state.data) ?? services.steam?.login
        }
        errorHint={state.issues?.steam}
      />
    </Tab>
  );
}
