'use client';

import { useEffect } from 'react';

import Country from '@ts/users/country';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction } from '@lib/hooks';
import CountryDataSkeleton from './CountryDataSkeleton';
import FetchImage from '@components/FetchImage';

type CountryDataProps = {
  country: string;
};

const COUNTRY_REGUEST_TIMEOUT = 10000;

const defaultCountry: Country = { error: false, data: { name: '', flag: '' } };

const getCountyData = async (country?: string) => {
  if (!country || !process.env.COUNTRIES_API) {
    return defaultCountry;
  }

  const countryData = await AxiosInstanse.post<Country>(
    process.env.COUNTRIES_API,
    { iso2: country },
    { timeout: COUNTRY_REGUEST_TIMEOUT }
  );

  return countryData.data;
};

export default function CountryData({ country }: CountryDataProps) {
  const [countryData, findCountry, isPending] = useAction<Country, string>(
    getCountyData,
    defaultCountry
  );

  useEffect(() => {
    findCountry(country);
  }, [country, findCountry]);

  if (isPending || !countryData.data.name) {
    return <CountryDataSkeleton />;
  }

  return (
    <div className='country'>
      <p>{countryData.data.name}</p>
      <FetchImage
        className='flag'
        src={countryData.data.flag}
        width={20}
        height={20}
        priority
      />
    </div>
  );
}
