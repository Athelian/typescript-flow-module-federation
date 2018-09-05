// @flow
import { is, pipe, when, either, map, reject, isNil, isEmpty, omit } from 'ramda';

export const replaceUndefined = when(
  either(is(Array), is(Object)),
  pipe(
    map(x => (x === undefined ? null : x)),
    map(a => replaceUndefined(a))
  )
);

export const removeNulls = when(
  either(is(Array), is(Object)),
  pipe(
    reject(isNil),
    map(a => removeNulls(a))
  )
);

export const removeEmpty = when(
  either(is(Array), is(Object)),
  pipe(
    reject(isEmpty),
    map(a => removeEmpty(a))
  )
);

export const replaceEmptyString = when(
  either(is(Array), is(Object)),
  pipe(
    map(x => (x === '' ? null : x)),
    map(a => replaceEmptyString(a))
  )
);

export const removeTypename = when(
  either(is(Array), is(Object)),
  pipe(
    x => (is(Object, x) && !is(Array, x) ? omit(['__typename'], x) : x),
    map(a => removeTypename(a))
  )
);

export const flatten = (object: any) => {
  const DELIMETER = '_';
  const output = {};

  const step = (currentObject: any, prevKey: ?string, currentDepth: number) => {
    Object.keys(currentObject).forEach(key => {
      const value = currentObject[key];
      const isArray = false && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isObject = type === '[object Object]' || type === '[object Array]';

      const newKey = prevKey ? prevKey + DELIMETER + key : key;

      if (!isArray && isObject && Object.keys(value).length) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
      return '';
    });
  };

  step(object, null, 1);

  return output;
};

export const unflatten = (target: any) => {
  const DELIMETER = '_';
  const output = {};

  const overwrite = true;

  if (Object.prototype.toString.call(target) !== '[object Object]') {
    return target;
  }

  const getkey = key => {
    const parsedKey = Number(key);

    return Number.isNaN(parsedKey) || key.indexOf('.') !== -1 ? key : parsedKey;
  };

  const sortedKeys = Object.keys(target).sort((keyA, keyB) => keyA.length - keyB.length);

  sortedKeys.forEach(key => {
    const split = key.split(DELIMETER);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = output;

    while (key2 !== undefined) {
      const type = Object.prototype.toString.call(recipient[key1]);
      const isObject = type === '[object Object]' || type === '[object Array]';

      if (!overwrite && !isObject && typeof recipient[key1] !== 'undefined') {
        return '';
      }

      if ((overwrite && !isObject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === 'number' ? [] : {};
      }

      recipient = recipient[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }

    recipient[key1] = unflatten(target[key]);

    return '';
  });

  return output;
};

export const flatten2 = (c: any) => {
  const d = '_';
  const r = {};
  (function f(o, p) {
    if (o) {
      Object.keys(o).forEach(k => {
        if (o[k] && /Array|Object/.test(o[k].constructor.name)) f(o[k], p ? `${p}${d}${k}` : k);
        (r[p ? `${p}${d}${k}` : k] = o[k]);
      });
    }
  })(c);
  return r;
};
