// @flow
import {
  is,
  path,
  pathOr,
  /* $FlowFixMe: useWith is not exist */
  useWith,
  split,
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
 * Return value from object with path
 */
export const getByPath = useWith(path, [split('.')]);

/**
 * Return value from object with path, return default value if undefined
 */
export const getByPathWithDefault = useWith(pathOr, [identity, split('.')]);

export { pipe, when, either, map, reject, isNil, isEmpty, omit };
