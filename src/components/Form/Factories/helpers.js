// @flow
import type { IntlShape } from 'react-intl';
import matchSorter from 'match-sorter';
import messages from './messages';

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

export function enumToString(enumType: string, intl: IntlShape): any => string {
  function enumString(enumValue: any): string {
    if (typeof enumValue === 'string') {
      return enumValue;
    }

    return enumValue?.description ?? enumValue?.name ?? '';
  }

  if (messages[enumType]) {
    return (enumValue: any): string => {
      const selectedValue = enumString(enumValue);
      const enumMessages = messages[enumType];
      return enumMessages[selectedValue]
        ? intl.formatMessage(enumMessages[selectedValue])
        : selectedValue;
    };
  }

  return enumString;
}
