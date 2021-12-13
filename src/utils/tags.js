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

export const cleanTagsData = (entity: Object) => {
  return removeNotFoundTag(entity);
};

export const reduceTagsByName = (tags: Object[]) => {
  return tags.reduce((arr, tag) => {
    if (!tag?.name) {
      return arr;
    }

    if (!arr[tag.name]) {
      // eslint-disable-next-line
      arr[tag.name] = {
        ...tag,
        integratedTags: {
          [tag.id]: tag,
        },
      };
    } else if (!arr[tag.name].integratedTags[tag.id]) {
      // eslint-disable-next-line
      arr[tag.name] = {
        ...arr[tag.name],
        integratedTags: {
          ...arr[tag.name].integratedTags,
          [tag.id]: tag,
        },
      };
    }

    return arr;
  }, {});
};

export default cleanTagsData;
