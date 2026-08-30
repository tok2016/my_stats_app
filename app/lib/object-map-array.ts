import { ExtractTypeFields } from '@ts/util-types';

type ChildIndexKey<T, IndexKey extends keyof T, GroupIndexType> =
  NonNullable<T[IndexKey]> extends object
    ? ExtractTypeFields<NonNullable<T[IndexKey]>, GroupIndexType>
    : undefined;

export default class ObjectMapArray<
  T extends object,
  IndexKey extends keyof T
> extends Iterator<T> {
  #array: Array<T>;
  #indexMap: Map<T[IndexKey] | string | number, number>;
  #key: IndexKey;

  #start: number;
  #end: number;
  #current: number;

  get count() {
    return this.#end;
  }

  constructor(array: Array<T>, key: IndexKey) {
    super();
    this.#array = [];
    this.#indexMap = new Map();
    this.#key = key;

    this.#start = 0;
    this.#end = 0;
    this.#current = this.#start;

    array.forEach((item) => {
      if (typeof this.#indexMap.get(item[this.#key]) === 'undefined') {
        this.#array.push(item);
        this.#indexMap.set(item[this.#key], this.#end++);
      }
    });
  }

  next(): IteratorResult<T> {
    if (this.#current >= this.#end) return { value: undefined, done: true };
    return { value: this.#array[this.#current++], done: false };
  }

  at(index: number): T | undefined {
    return this.#array.at(index);
  }

  drop(count: number): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.slice(count - 1), this.#key);
  }

  every(predicate: (value: T, index: number) => boolean): boolean {
    return this.#array.every(predicate);
  }

  filter(
    predicate: (value: T, index: number) => boolean
  ): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.filter(predicate), this.#key);
  }

  find(predicate: (value: T, index: number) => boolean): T | undefined {
    return this.#array.find(predicate);
  }

  findByKey(key: T[IndexKey] | string | number): T | undefined {
    const index = this.#indexMap.get(key);
    if (typeof index === 'undefined') return undefined;
    return this.#array[index];
  }

  flatMap<U>(
    callback: (value: T, index: number) => U[]
  ): IteratorObject<U, undefined, unknown> {
    const flatten = this.#array.flatMap<U>(callback);
    let index = 0;

    return Iterator.from({
      next() {
        const done = index >= flatten.length;
        return { value: flatten[index++], done };
      }
    });
  }

  flatMapByKey<
    U extends object | undefined,
    UIndexKey extends keyof NonNullable<U>
  >(
    callback: (value: T, index: number) => U[],
    key: UIndexKey
  ): ObjectMapArray<NonNullable<U>, UIndexKey> {
    return new ObjectMapArray(
      this.#array.flatMap(callback).filter((item) => !!item),
      key
    );
  }

  forEach(callbackfn: (value: T, index: number) => void): void {
    this.#array.forEach(callbackfn);
  }

  flatGroupBy<
    U extends object,
    GroupKey extends keyof U,
    ItemType,
    OriginalIndexKey extends ExtractTypeFields<T, Array<ItemType> | undefined>,
    TSafe extends T & Record<OriginalIndexKey, Array<ItemType> | undefined> = T
      & Record<OriginalIndexKey, Array<ItemType>>
  >(
    aggregate: (
      parent: T,
      value: ItemType,
      stored: U | undefined,
      index: number
    ) => U | undefined,
    itemKey: OriginalIndexKey,
    groupKey: GroupKey,
    childKey: ItemType extends object
      ? ExtractTypeFields<ItemType, U[GroupKey]>
      : undefined
  ): ObjectMapArray<U, GroupKey> {
    const grouped = new ObjectMapArray<U, GroupKey>([], groupKey);

    this.#array.forEach((parent) => {
      (parent as never as TSafe)?.[itemKey]?.forEach((item, i) => {
        const key = childKey ? item[childKey] : item;
        const groupedItem = grouped.findByKey(key as never);
        const newValue = aggregate(parent, item, groupedItem, i);
        if (newValue) grouped.push(newValue);
      });
    });

    return grouped;
  }

  groupBy<
    U extends object,
    GroupKey extends keyof U,
    OriginalIndexKey extends keyof T
  >(
    aggregate: (
      parent: T,
      value: T[OriginalIndexKey],
      stored: U | undefined,
      index: number
    ) => U | undefined,
    itemKey: OriginalIndexKey,
    groupKey: GroupKey,
    childKey: ChildIndexKey<T, OriginalIndexKey, U[GroupKey]>
  ): ObjectMapArray<U, GroupKey> {
    const grouped = new ObjectMapArray<U, GroupKey>([], groupKey);
    this.#array.forEach((item, i) => {
      const key = childKey ? item[itemKey]?.[childKey] : item[itemKey];
      const groupedItem = grouped.findByKey(key as never);
      const newValue = aggregate(item, item[itemKey], groupedItem, i);
      if (newValue) grouped.push(newValue);
    });

    return grouped;
  }

  map<U>(
    callbackfn: (value: T, index: number) => U
  ): IteratorObject<U, undefined, unknown> {
    const mapped = this.#array.map(callbackfn);
    let index = 0;

    return Iterator.from({
      next() {
        const done = index >= mapped.length;
        return { value: mapped[index++], done };
      }
    });
  }

  mapByKey<
    U extends object | undefined,
    UIndexKey extends keyof NonNullable<U>
  >(
    callbackfn: (value: T, index: number) => U,
    key: UIndexKey
  ): ObjectMapArray<NonNullable<U>, UIndexKey> {
    return new ObjectMapArray(
      this.#array.map(callbackfn).filter((item) => !!item),
      key
    );
  }

  pop(): T | undefined {
    const lastItem = this.#array.pop();
    if (!lastItem) return undefined;

    this.#indexMap.delete(lastItem[this.#key]);
    if (this.#current >= --this.#end) this.#current--;
    return lastItem;
  }

  push(value: T): void {
    const stored = this.#indexMap.get(value[this.#key]);
    if (typeof stored === 'undefined') {
      this.#array.push(value);
      this.#indexMap.set(value[this.#key], this.#end++);
    } else {
      this.#array[stored] = value;
    }
  }

  reduce(
    callbackfn: (prev: T, curr: T, index: number) => T,
    initialValue?: T
  ): T {
    if (typeof initialValue === 'undefined')
      return this.#array.reduce(callbackfn);
    return this.#array.reduce(callbackfn, initialValue);
  }

  reduceByKey<ValueKey extends keyof T>(
    key: ValueKey,
    callbackfn: (
      prev: T[ValueKey],
      curr: T[ValueKey],
      index: number
    ) => T[ValueKey],
    initialValue: T[ValueKey]
  ) {
    let result = initialValue;
    this.#array.forEach((item, i, arr) => {
      result = callbackfn(
        i === 0 ? initialValue : arr[i - 1][key],
        item[key],
        i
      );
    });

    return result;
  }

  remove(key: T[IndexKey]): T | undefined {
    const index = this.#indexMap.get(key);
    if (typeof index === 'undefined') return undefined;

    const item = this.#array[index];
    this.#indexMap.delete(key);
    this.#array = [
      ...this.#array.slice(0, index),
      ...this.#array.slice(index + 1)
    ];

    if (this.#current >= --this.#end) this.#current--;
    return item;
  }

  return(): IteratorResult<T, undefined> {
    return { value: this.#array[this.#current] };
  }

  slice(start: number, end?: number): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.slice(start, end), this.#key);
  }

  some(predicate: (value: T, index: number) => boolean): boolean {
    return this.#array.some(predicate);
  }

  sort(callbackfn: (a: T, b: T) => number): ObjectMapArray<T, IndexKey> {
    this.#array.sort(callbackfn);
    this.#indexMap = new Map(
      this.#array.map((item, i) => [item[this.#key], i])
    );
    return this;
  }

  take(limit: number): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.slice(0, limit), this.#key);
  }

  toArray(): T[] {
    return this.#array;
  }
}
