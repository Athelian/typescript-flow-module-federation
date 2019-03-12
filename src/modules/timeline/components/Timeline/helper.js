// @flow
import isSameDay from 'date-fns/isSameDay';
import type { LogItem } from '../Log';
import type { CommentItem } from '../Comment';
import type { DateItem } from '../DateSeparator';

type Entry = LogItem | CommentItem;
type DecorateEntry = Entry | DateItem;

const normalizeValue = (value: any): any => {
  if (!value) {
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  switch (value.__typename) {
    case 'StringValue':
      return value.string;
    case 'IntValue':
      return value.int;
    case 'FloatValue':
      return value.float;
    case 'BooleanValue':
      return value.boolean;
    case 'DateTimeValue':
      return value.datetime;
    case 'MetricValueValue':
      return value.metricValue;
    case 'SizeValue':
      return value.size;
    case 'EntityValue':
      return value.entity;
    case 'Values':
      return value.values.map(normalizeValue);
    default:
      return null;
  }
};

const normalizeParameters = (
  parameters: Array<{ key: string, value: any }>
): { [key: string]: any } =>
  parameters.reduce(
    (normalizedParameters, param) => ({
      ...normalizedParameters,
      [param.key]: normalizeValue(param.value),
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
          date: entry.createdAt,
        });
      }

      items.push(entry);

      return items;
    },
    []
  );
