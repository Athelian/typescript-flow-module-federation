// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import { filterItems } from 'components/Form/Factories/helpers';
import usePrevious from 'hooks/usePrevious';
import { useEnumInput } from 'modules/form/hooks';

import { EnumInputStyle, DeleteButtonStyle } from './style';

type OptionalProps = {
  value: Object,
  onRemove?: Function,
};

type Props = OptionalProps & {
  data: Array<Object>,
  onChange: Function,
};

const defaultProps = {
  value: { description: '' },
};

export default function EnumInput({ data, value, onChange, onRemove }: Props) {
  const { hasError, isFocused, setValue, ...inputHandlers } = useEnumInput(value.description, {
    isRequired: false,
  });

  const prevValue = usePrevious(value.description);
  React.useEffect(() => {
    if (prevValue && value.description === '') {
      setValue('');
    }
  });

  return (
    <div className={EnumInputStyle}>
      <SearchSelectInput
        {...inputHandlers}
        items={filterItems(inputHandlers.value, data)}
        itemToString={item => (item ? item.description || item.name : '')}
        itemToValue={item => (item ? item.description : '')}
        inputValue={inputHandlers.value}
        renderSelect={({ ...selectProps }) => (
          <DefaultSearchSelect
            forceHoverStyle
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
            itemToValue={item => (item ? item.description : '')}
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
          const currentItem = data.find(item => item.description === inputHandlers.value);
          if (currentItem) {
            inputHandlers.onBlur();
            onChange({
              ...currentItem,
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
                value: item.description,
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
