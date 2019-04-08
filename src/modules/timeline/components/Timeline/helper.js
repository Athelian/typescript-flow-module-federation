// @flow
import isSameDay from 'date-fns/isSameDay';
import { uuid } from 'utils/id';
import type { CommentItem, DateItem, LogItem } from 'modules/timeline/types';

type Entry = LogItem | CommentItem;
type DecorateEntry = Entry | DateItem;

const normalizeParameters = (
  parameters: Array<{ key: string, value: any }>
): { [key: string]: any } =>
  parameters.reduce(
    (normalizedParameters, param) => ({
      ...normalizedParameters,
      [param.key]: param.value,
    }),
    {}
  );

export const normalizeEntries = (entries: Array<Object>): Array<Entry> =>
  entries.reduce((normalizedEntries: Array<Entry>, entry: Object): Array<Entry> => {
    // eslint-disable-next-line no-underscore-dangle
    switch (entry.__typename) {
      case 'Event':
        normalizedEntries.push(
          ...entry.logs.map(({ parameters, ...log }) => ({
            ...log,
            parentEntity: entry.entity,
            parameters: normalizeParameters(parameters),
            createdAt: new Date(entry.createdAt),
            createdBy: entry.createdBy,
          }))
        );
        break;
      case 'Comment':
        normalizedEntries.push({
          ...entry,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        });
        break;
      default:
        break;
    }

    return normalizedEntries;
  }, []);

export const decorateEntries = (entries: Array<Entry>): Array<DecorateEntry> =>
  entries.reduce(
    (
      items: Array<DecorateEntry>,
      entry: Entry,
      index: number,
      array: Array<Entry>
    ): Array<DecorateEntry> => {
      if (index === 0 || (index > 0 && !isSameDay(entry.createdAt, array[index - 1].createdAt))) {
        items.push({
          __typename: 'DateSeparator',
          id: uuid(),
          date: entry.createdAt,
        });
      }

      items.push(entry);

      return items;
    },
    []
  );
