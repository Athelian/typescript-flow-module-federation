// @flow
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
  pipe,
  when,
  either,
  map,
  reject,
  isNil,
  isEmpty,
  omit,
  pick,
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

/**
 * Return value from object with path
 */
export const getByPath = useWith(path, [split('.')]);

export const pickByProps = pick;

/**
 * Return value from object with path, return default value if undefined
 */
export const getByPathWithDefault = useWith(pathOr, [identity, split('.')]);

export { pipe, when, either, map, reject, isNil, isEmpty, omit, pick };

export const isValuable = (val: any) => val != null;
export const isValuables = (...arr: Array<any>) => arr.every(val => val != null);
