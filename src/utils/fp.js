// @flow
/* $FlowFixMe: useWith is not exist */
import { is, path, pathOr, useWith, range, split, identity, equals, take } from 'ramda';

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

/**
 * Return value from object with path, return default value if undefined
 */
export const getByPathWithDefault = useWith(pathOr, [identity, split('.')]);
