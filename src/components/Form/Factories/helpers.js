// @flow
import matchSorter from 'match-sorter';

export const parseEnumValue = (enumValue: ?string | ?{ name: string }) => {
  if (enumValue && enumValue.name) return enumValue.name;
  return enumValue;
};

export const parseEnumDescriptionOrValue = (
  enumValue: ?string | ?{ description: string, name: string }
) => {
  if (enumValue && enumValue.description) return enumValue.description;
  return parseEnumValue(enumValue);
};

export const convertValueToFormFieldFormat = (value: mixed): { target: { value: mixed } } => ({
  target: {
    value,
  },
});

export function filterItems<T>(query: string, items: Array<T>): Array<T> {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
}
