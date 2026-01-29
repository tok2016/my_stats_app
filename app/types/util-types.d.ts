export type RequiredFields<Data, Key extends keyof Data> = Data
  & Required<Pick<Data, Key>>;

export type Entries<Data> = ReturnType<typeof Object.entries<Data>>;

export type LiteralType<T extends string> = T | (string & {});
