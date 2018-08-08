// @flow
import { isDataType, when, pipe, map, either, reject, isNil, isEmpty, omit } from 'utils/fp';

export const replaceUndefined = when(
  either(isDataType(Array), isDataType(Object)),
  pipe(
    map(x => (x === undefined ? null : x)),
    map(a => replaceUndefined(a))
  )
);

export const removeNulls = when(
  either(isDataType(Array), isDataType(Object)),
  pipe(
    reject(isNil),
    map(a => removeNulls(a))
  )
);

export const removeEmpty = when(
  either(isDataType(Array), isDataType(Object)),
  pipe(
    reject(isEmpty),
    map(a => removeEmpty(a))
  )
);

export const replaceEmptyString = when(
  either(isDataType(Array), isDataType(Object)),
  pipe(
    map(x => (x === '' ? null : x)),
    map(a => replaceEmptyString(a))
  )
);

export const removeTypename = when(
  either(isDataType(Array), isDataType(Object)),
  pipe(
    x => (isDataType(Object, x) && !isDataType(Array, x) ? omit(['__typename'], x) : x),
    map(a => removeTypename(a))
  )
);
