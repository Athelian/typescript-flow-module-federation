// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import Icon from 'components/Icon';
import { SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import { useTextInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

import { EnumInputStyle, DeleteButtonStyle } from './style';

type Props = {
  data: Array<Object>,
  value: Object,
  onChange: Function,
  onRemove: Function,
};

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

export default function EnumInput({ data, value, onChange, onRemove }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value.name, { isRequired: true });
  return (
    <div className={EnumInputStyle}>
      <SearchSelectInput
        {...inputHandlers}
        items={filterItems(inputHandlers.value, data)}
        itemToString={item => (item ? item.description || item.name : '')}
        itemToValue={item => (item ? item.name : '')}
        inputValue={inputHandlers.value}
        renderSelect={({ ...selectProps }) => (
          <DefaultSearchSelect
            {...selectProps}
            hasError={hasError}
            isOpen={isFocused}
            width="200px"
            align="left"
            itemToString={item => (item ? item.description || item.name : '')}
          />
        )}
        renderOptions={({ ...optionProps }) => (
          <DefaultOptions
            {...optionProps}
            items={filterItems(inputHandlers.value, data)}
            itemToString={item => (item ? item.description || item.name : '')}
            itemToValue={item => (item ? item.name : '')}
            width="200px"
            align="left"
          />
        )}
        afterClearSelection={() => {
          inputHandlers.onChange({
            currentTarget: {
              value: '',
            },
          });
          setTimeout(() => {
            inputHandlers.onBlur();
            onChange({ name: '', description: '' });
            inputHandlers.onFocus();
          }, 0);
        }}
        onBlur={() => {
          if (data.find(item => item.name === inputHandlers.value)) {
            inputHandlers.onBlur();
            onChange({
              name: inputHandlers.value,
            });
          } else {
            inputHandlers.onChange({
              currentTarget: {
                value: '',
              },
            });
            setTimeout(() => {
              onChange({
                name: '',
              });
              inputHandlers.onBlur();
            }, 0);
          }
        }}
        onChange={(item: Object) => {
          if (!item) {
            inputHandlers.onChange({
              currentTarget: {
                value: '',
              },
            });
          } else {
            inputHandlers.onChange({
              currentTarget: {
                value: item.name,
              },
            });
          }
        }}
        onSearch={newQuery => {
          inputHandlers.onChange({
            currentTarget: {
              value: newQuery,
            },
          });
        }}
      />
      <button className={DeleteButtonStyle} type="button" onClick={onRemove}>
        <Icon icon="REMOVE" />
      </button>
    </div>
  );
}
