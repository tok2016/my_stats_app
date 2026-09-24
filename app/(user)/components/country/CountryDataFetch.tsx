'use client';

import { useEffect } from 'react';

import Country from '@ts/users/country';

import { useAction } from '@lib/hooks';
import { getCountryData } from '@lib/server-actions';
import { defaultCountry } from '@lib/utils';

import FetchImage from '@components/FetchImage';

import CountryDataSkeleton from './CountryDataSkeleton';

type CountryDataFetchProps = {
  countryIso: string;
};

/**
 * @param props
 * @param props.countryIso - Country ISO code.
 * @returns Country name and flag that were fetched by country code.
 */
export default function CountryDataFetch({
  countryIso
}: CountryDataFetchProps) {
  const [countryData, findCountry, isPending] = useAction<Country, string>(
    getCountryData,
    defaultCountry
  );

  useEffect(() => {
    findCountry(countryIso);
  }, [countryIso, findCountry]);

  if (isPending || countryIso !== countryData.iso2) {
    return <CountryDataSkeleton />;
  } else if (!countryData.name) {
    return <p>Unknown country</p>;
  }

  return (
    <div className='country'>
      <p>{countryData.name}</p>
      <FetchImage
        alt={`Flag of ${countryData.name}`}
        className='flag'
        src={countryData.flag}
        width={20}
        height={20}
        priority
      />
    </div>
  );
}
