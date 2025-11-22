export default interface Country {
  error: boolean;
  data: {
    name: string;
    flag: string;
  };
}

export interface Countries {
  error: boolean;
  data: {
    name: string;
    Iso2: string;
  }[];
}
