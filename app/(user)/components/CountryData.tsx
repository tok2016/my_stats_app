'use client';

import { useEffect } from 'react';

import Country from '@ts/users/country';

import { useAction } from '@lib/hooks';
import CountryDataSkeleton from './CountryDataSkeleton';
import FetchImage from '@components/FetchImage';
import { getCountyData } from '../actions';
import { defaultCountry } from '@lib/utils';

type CountryDataProps = {
  country: string;
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
