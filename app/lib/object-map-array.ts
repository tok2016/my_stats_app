import { ExtractTypeFields } from '@ts/util-types';

type ChildIndexKey<T, IndexKey extends keyof T, GroupIndexType> =
  NonNullable<T[IndexKey]> extends object
    ? ExtractTypeFields<NonNullable<T[IndexKey]>, GroupIndexType>
    : undefined;

/**
 * HashSet-like collection for objects.
 * The core of collection is an array of objects, so it acts the same as Array.
 * It also has index map of objects' key values (or index key values) and their indexes in array.
 * Finds element by given key (or index key) value with O(1).
 * Groups and aggragates objects by other key with O(n).
 * Turns to array with O(1).
 */
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

  /**
   * Retuns elements count.
   */
  get count() {
    return this.#end;
  }

  /**
   * Initializes new object map array.
   * @param array - Array of object.
   * @param key - Object key which values will be used as a keys for index map.
   */
  constructor(array: Array<T> | ObjectMapArray<T, IndexKey>, key: IndexKey) {
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

  /**
   * @returns Iterator result with the next element.
   */
  next(): IteratorResult<T> {
    if (this.#current >= this.#end) return { value: undefined, done: true };
    return { value: this.#array[this.#current++], done: false };
  }

  /**
   * @param index
   * @returns Element at given index.
   */
  at(index: number): T | undefined {
    return this.#array.at(index);
  }

  /**
   * @param count - How many elements since the first elements will be removed.
   * @returns New object map array without first count elements.
   */
  drop(count: number): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.slice(count - 1), this.#key);
  }

  /**
   * @param predicate
   * @returns True if every element corresponds predicate result.
   */
  every(predicate: (value: T, index: number) => boolean): boolean {
    return this.#array.every(predicate);
  }

  /**
   * @param predicate
   * @returns New object map array with filtered elements.
   */
  filter(
    predicate: (value: T, index: number) => boolean
  ): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.filter(predicate), this.#key);
  }

  /**
   * @param predicate
   * @returns First element that correspond the predicate result.
   */
  find(predicate: (value: T, index: number) => boolean): T | undefined {
    return this.#array.find(predicate);
  }

  /**
   * @param key - Value of index map to find element by.
   * @returns Element with the same key value.
   */
  findByKey(key: T[IndexKey] | string | number): T | undefined {
    const index = this.#indexMap.get(key);
    if (typeof index === 'undefined') return undefined;
    return this.#array[index];
  }

  /**
   * @param callback
   * @returns New flatten iterator object with elements of arrays returned by callback.
   */
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

  /**
   * @param callback
   * @param key - Index key of new collection.
   * @returns New flatten object map array with elements of arrays returned by callback. Skips empty values.
   */
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

  /**
   * Iterates the collection.
   * @param callbackfn
   */
  forEach(callbackfn: (value: T, index: number) => void): void {
    this.#array.forEach(callbackfn);
  }

  /**
   * Groups elements by elements (index elements) of nested array indexed by itemKey.
   * @param aggregate - Aggregation function that return the element for new collection.
   * @param itemKey - Key of elements from original collection.
   * It indexes the array of index elements used to group original elements.
   * Index elements are also used to index stored element from aggregated collection.
   * @param groupKey - Index key of new collection.
   * @param childKey - Key of index elements to index stored elements from aggregated collection.
   * This key is used ONLY when index element is object.
   * @returns New aggregated object map array with grouped values.
   */
  flatGroupBy<
    U extends object,
    GroupKey extends keyof U,
    ItemType,
    OriginalIndexKey extends ExtractTypeFields<T, Array<ItemType> | undefined>,
    TSafe extends T & Record<OriginalIndexKey, Array<ItemType> | undefined> = T
      & Record<OriginalIndexKey, Array<ItemType>>
  >(
    /**
     * @param parent - Element from original collection.
     * @param value - Index element (element of array indexed by itemKey).
     * @param stored - Element of aggregated collection that was stored.
     * @param index - Index of nested array.
     */
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

  /**
   * Groups elements by values (index values) indexed by given itemKey.
   * @param aggregate - Aggregation function that return the element for new collection.
   * @param itemKey - Key of element from original collection.
   * It indexes the values (index values) that the original elements will be grouped by.
   * This key is used to index stored elements from aggregated collection.
   * @param groupKey - Index key of new collection.
   * @param childKey - Key of index values to index stored elements from aggregated collection.
   * This key is used ONLY when index value is object.
   * @returns
   */
  groupBy<
    U extends object,
    GroupKey extends keyof U,
    OriginalIndexKey extends keyof T
  >(
    /**
     * @param parent - Element from original collection.
     * @param value - Index value (value indexed by itemKey).
     * @param stored - Element of aggregated collection that was stored.
     * @param index - Index of original element.
     */
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

  /**
   * @param callbackfn
   * @returns New iterator object with elements returned by callback.
   */
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

  /**
   * @param callbackfn
   * @param key - Index key of new collection.
   * @returns New object map array with elements returned by callback. Skips empty values.
   */
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

  /**
   * Removes the last element.
   * @returns Last element of object map array.
   */
  pop(): T | undefined {
    const lastItem = this.#array.pop();
    if (!lastItem) return undefined;

    this.#indexMap.delete(lastItem[this.#key]);
    if (this.#current >= --this.#end) this.#current--;
    return lastItem;
  }

  /**
   * Adds new element to the end of collection.
   * If given element with the same value at index key already exists in collection,
   * replaces the old element with given one.
   * @param value - New value to add.
   */
  push(value: T): void {
    const stored = this.#indexMap.get(value[this.#key]);
    if (typeof stored === 'undefined') {
      this.#array.push(value);
      this.#indexMap.set(value[this.#key], this.#end++);
    } else {
      this.#array[stored] = value;
    }
  }

  /**
   * @param callbackfn
   * @param initialValue - Initial value of reduced value.
   * @returns Reduced value.
   */
  reduce(
    callbackfn: (prev: T, curr: T, index: number) => T,
    initialValue?: T
  ): T {
    if (typeof initialValue === 'undefined')
      return this.#array.reduce(callbackfn);
    return this.#array.reduce(callbackfn, initialValue);
  }

  /**
   * Reduces collection by given key.
   * @param key - Key to reduce by.
   * @param callbackfn - Function that return intermediate reduced value.
   * Gives only values of given key as an arguments.
   * @param initialValue - Initial value of reduced value.
   * @returns Reduced value.
   */
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
    this.#array.forEach((item, i) => {
      result = callbackfn(result, item[key], i);
    });

    return result;
  }

  /**
   * Removes the element with given value at index key.
   * @param keyValue - Value of index key.
   * @returns Removed element.
   */
  remove(keyValue: T[IndexKey]): T | undefined {
    const index = this.#indexMap.get(keyValue);
    if (typeof index === 'undefined') return undefined;

    const item = this.#array[index];
    this.#indexMap.delete(keyValue);
    this.#array = [
      ...this.#array.slice(0, index),
      ...this.#array.slice(index + 1)
    ];

    if (this.#current >= --this.#end) this.#current--;
    return item;
  }

  /**
   * @returns Current element of collection.
   */
  return(): IteratorResult<T, undefined> {
    return { value: this.#array[this.#current] };
  }

  /**
   * @param start - Index of element from original collection that would be the first in new one.
   * @param end - Index of element from original collection that would be the last in new one.
   * If it's empty, the last element will be the last element of original collection.
   * @returns New sliced object map array.
   */
  slice(start: number, end?: number): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.slice(start, end), this.#key);
  }

  /**
   * @param predicate
   * @returns True if at least one element corresponds the predicate result.
   */
  some(predicate: (value: T, index: number) => boolean): boolean {
    return this.#array.some(predicate);
  }

  /**
   * Sort the original collection.
   * @param callbackfn
   * @returns Sorted ORIGINAL object map array.
   */
  sort(callbackfn: (a: T, b: T) => number): ObjectMapArray<T, IndexKey> {
    this.#array.sort(callbackfn);
    this.#indexMap = new Map(
      this.#array.map((item, i) => [item[this.#key], i])
    );
    return this;
  }

  /**
   * @param limit
   * @returns New object map array without last limit elements.
   */
  take(limit: number): ObjectMapArray<T, IndexKey> {
    return new ObjectMapArray(this.#array.slice(0, limit), this.#key);
  }

  /**
   * @returns Core array of object map array.
   */
  toArray(): T[] {
    return this.#array;
  }
}
