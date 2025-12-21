'use client';

import { useEffect } from 'react';

import Country from '@ts/users/country';

import { useAction } from '@lib/hooks';
import CountryDataSkeleton from './CountryDataSkeleton';
import FetchImage from '@components/FetchImage';
import { getCountyData } from '@lib/server-actions';
import { defaultCountry } from '@lib/utils';

type CountryDataFetchProps = {
  country: string;
};

export default function CountryDataFetch({ country }: CountryDataFetchProps) {
  const [countryData, findCountry, isPending] = useAction<Country, string>(
    getCountyData,
    defaultCountry
  );

  useEffect(() => {
    findCountry(country);
  }, [country, findCountry]);

  if (isPending || country !== countryData.iso2) {
    return <CountryDataSkeleton />;
  } else if (!countryData.name) {
    return <p>Unknown country</p>;
  }

  return (
    <div className='country'>
      <p>{countryData.name}</p>
      <FetchImage
        className='flag'
        src={countryData.flag}
        width={20}
        height={20}
        priority
      />
    </div>
  );
}
