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

const defaultCountry: Country = { error: false, data: { name: '', flag: '' } };

const getCountyData = async (country?: string) => {
  if (!country) {
    return defaultCountry;
  }

  const countryData = await AxiosInstanse.post<Country>(
    'https://countriesnow.space/api/v0.1/countries/flag/images',
    { iso2: country }
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
      />
    </div>
  );
}
