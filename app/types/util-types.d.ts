export type RequiredFields<Data, Key extends keyof Data> = Data
  & Required<Pick<Data, Key>>;

export type Entries<Data> = ReturnType<typeof Object.entries<Data>>;

export type LiteralType<T extends string | number | symbol> = T | (string & {});

export type ExtractTypeFields<T, TypeToExtract> = Exclude<
  {
    [K in keyof T]: NonNullable<T>[K] extends TypeToExtract ? K : never;
  }[keyof T],
  undefined
>;

export type ExtractTypeFields1<T, TypeToExtract> = {
  [P in keyof T as T[P] extends TypeToExtract ? P : never]: T[P];
};
