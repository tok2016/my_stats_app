import Country from '@ts/users/country';

import FetchImage from '@components/FetchImage';

type CountryDataProps = {
  country: Country;
};

/**
 * @param props
 * @param props.country - Country data with name and flag url.
 * @returns Country name and flag.
 */
export default function CountryData({ country }: CountryDataProps) {
  return (
    <div className='country'>
      <p className='country__name'>{country.name}</p>
      <FetchImage
        alt={`Flag of ${country.name}`}
        className='country__flag'
        src={country.flag}
        width={20}
        height={20}
        priority
      />
    </div>
  );
}
