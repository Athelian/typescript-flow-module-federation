// @flow
import { is, when, either, prop, map, pipe, reject } from 'ramda';
import { isNotFound } from './data';

export const removeNotFound: Function = when(is(Array), reject(isNotFound));

export const removeNotFoundTag: Function = when(
  either(is(Array), is(Object)),
  pipe(
    x =>
      is(Object, x) && !is(Array, x) && prop('tags', x)
        ? { ...x, tags: removeNotFound(x.tags) }
        : x,
    map(a => removeNotFoundTag(a))
  )
);

export function cleanTagsData(entity: Object) {
  return removeNotFoundTag(entity);
}

export default cleanTagsData;
