import Service from '@ts/users/service';

import Input from '@components/Input';
import { ServiceStatusColors, ServiceStatusNames } from '../../utils';

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
          className={`bold ${ServiceStatusColors[serviceData?.status ?? 'unauthorized']}`}
        >
          {ServiceStatusNames[serviceData?.status ?? 'unauthorized']}
        </span>
      </p>

      <Input
        id='steam'
        name='steam'
        label='Steam ID or Profile URL'
        placeholder='XXXXXXXXXXXXXXXXX'
        defaultValue={defaultValue}
        errorHint={errorHint}
        hint={
          <span className='warning'>
            {`We collect your video games data. We can't pull it from Steam unless your Profile and Game details are set Public.`}
          </span>
        }
      />
    </div>
  );
}
