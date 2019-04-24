// @flow
import {
  is,
  path,
  pathOr,
  /* $FlowFixMe: useWith is not exist */
  useWith as doWith,
  split,
  range,
  identity,
  equals,
  take,
  either,
  map,
  isNil,
  lens,
  assocPath,
  set,
  pick,
} from 'ramda';

export {
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
export const getByPath = (valuePath: string, object: *) =>
  doWith(path, [split('.')])(valuePath, object);

export const pickByProps = pick;

/* Checks if the input value is null or undefined. */
export const isNullOrUndefined = isNil;

/**
 * Return value from object with path, return default value if undefined
 */
export const getByPathWithDefault = (defaultValue: *, valuePath: string, object: *) =>
  doWith(pathOr, [identity, split('.')])(defaultValue, valuePath, object);

export const isValuable = (val: any) => val != null;
export const isValuables = (...arr: Array<any>) => arr.every(val => val != null);

export const setIn = (propPath: string, value: any, onObject: any): any => {
  const pathToArray = propPath.split('.');
  const propLens = lens(path(pathToArray), assocPath(pathToArray));
  return set(propLens, value, onObject);
};

export const arrayToObject = (inputArray: Array<Object>, keyField: string) =>
  inputArray.reduce((obj, item) => ({ ...obj, [item[keyField]]: item }), {});
