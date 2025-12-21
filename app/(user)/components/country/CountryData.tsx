import Country from '@ts/users/country';

import FetchImage from '@components/FetchImage';

type CountryDataProps = {
  country: Country;
};

export default function CountryData({ country }: CountryDataProps) {
  return (
    <div className='country'>
      <p>{country.name}</p>
      <FetchImage
        className='flag'
        src={country.flag}
        width={20}
        height={20}
        priority
      />
    </div>
  );
}
