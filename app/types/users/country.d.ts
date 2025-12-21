export default interface Country {
  name: string;
  flag: string;
  iso2: string;
}

export interface CountryIso {
  name: string;
  Iso2: string;
}

export interface CountryResponse<CountryData> {
  error: boolean;
  data: CountryData;
}
