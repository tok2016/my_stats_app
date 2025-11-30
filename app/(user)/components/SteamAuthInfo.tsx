import Service from '@ts/users/service';

import Input from '@components/Input';
import { ServiceStatusColors, ServiceStatusNames } from '../utils';

type ServiceAuthInfoProps = {
  serviceData?: Service;
  defaultValue?: string;
  errorHint?: string;
};

export default function SteamAuthInfo({
  serviceData,
  defaultValue,
  errorHint
}: ServiceAuthInfoProps) {
  return (
    <div className='service-auth-info'>
      <h4>Steam</h4>

      <p>
        Status:{' '}
        <span
          className={ServiceStatusColors[serviceData?.status ?? 'unauthorized']}
        >
          {ServiceStatusNames[serviceData?.status ?? 'unauthorized']}
        </span>
      </p>

      <Input
        id='steam'
        name='steam'
        label='Account name'
        placeholder='steam1234'
        defaultValue={defaultValue}
        errorHint={errorHint}
      />
    </div>
  );
}
