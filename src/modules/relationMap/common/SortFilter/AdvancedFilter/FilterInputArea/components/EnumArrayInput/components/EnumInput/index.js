// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import Icon from 'components/Icon';
import { SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import { useTextInput, usePrevious } from 'modules/form/hooks';

import { EnumInputStyle, DeleteButtonStyle } from './style';

type OptionalProps = {
  value: Object,
  onRemove?: Function,
};

type Props = OptionalProps & {
  data: Array<Object>,
  onChange: Function,
};

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

const defaultProps = {
  value: { name: '' },
};

export default function EnumInput({ data, value, onChange, onRemove }: Props) {
  const { hasError, isFocused, setValue, ...inputHandlers } = useTextInput(value.name, {
    isRequired: false,
  });

  const prevValue = usePrevious(value.name);
  React.useEffect(() => {
    if (prevValue && value.name === '') {
      setValue('');
    }
    return null;
  });

  return (
    <div className={EnumInputStyle}>
      <SearchSelectInput
        {...inputHandlers}
        items={filterItems(inputHandlers.value, data)}
        itemToString={item => (item ? item.name || item.description : '')}
        itemToValue={item => (item ? item.name : '')}
        inputValue={inputHandlers.value}
        renderSelect={({ ...selectProps }) => (
          <DefaultSearchSelect
            {...selectProps}
            hasError={hasError}
            isOpen={isFocused}
            width="200px"
            align="left"
            itemToString={item => (item ? item.name || item.description : '')}
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
            onChange();
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
              inputHandlers.onBlur();
              onChange();
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
      {!!onRemove && (
        <button className={DeleteButtonStyle} type="button" onClick={onRemove}>
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  );
}

EnumInput.defaultProps = defaultProps;
