// @flow
/* eslint-disable react-hooks/rules-of-hooks */
// disable hooks on this file due to that plugin think that `useWith` is a hook
import {
  is,
  path,
  pathOr,
  /* $FlowFixMe: useWith is not exist */
  useWith,
  split,
  range,
  identity,
  equals,
  take,
  either,
  map,
  isNil,
  set,
  pick,
  lensProp,
  lensIndex,
  compose as compose2,
} from 'ramda';

export {
  clone,
  pipe,
  when,
  reject,
  isEmpty,
  omit,
  pick,
  head,
  contains,
  flatten,
  compose,
  uniq,
} from 'ramda';
/**
 * See if an object (val) is an instance of the supplied constructor. This function will check up the inheritance chain, if any.
 */
export const isDataType = is;

/**
 * Returns true if its arguments are equivalent, false otherwise. Handles cyclical data structures.
 */
export const isEquals = equals;

/**
 * Returns the first n elements of the given list
 */
export const takeItems = take;

/**
 *  Returns a list of numbers from from (inclusive) to to (exclusive).
 */
export const inRange = range;

export const isEither = either;

export const mapOver = map;

/**
 * Return value from object with path
 */
export const getByPath: (path: string, subject: any) => any = useWith(path, [split('.')]);

export const pickByProps = pick;

/* Checks if the input value is null or undefined. */
export const isNullOrUndefined = isNil;

/**
 * Return value from object with path, return default value if undefined
 */
export const getByPathWithDefault: (defaultValue: any, path: string, subject: any) => any = useWith(
  pathOr,
  [identity, split('.')]
);

export const isValuable = (val: any) => val != null;
export const isValuables = (...arr: Array<any>) => arr.every(val => val != null);

export const setIn = (propPath: string, value: any, subject: any): any => {
  const lens = compose2(
    ...propPath
      .split('.')
      .map(key => (!Number.isNaN(parseFloat(key)) ? lensIndex(parseFloat(key)) : lensProp(key)))
  );

  return set(lens, value, subject);
};

export const arrayToObject = (inputArray: Array<Object>, keyField: string) =>
  inputArray.reduce((obj, item) => ({ ...obj, [item[keyField]]: item }), {});
