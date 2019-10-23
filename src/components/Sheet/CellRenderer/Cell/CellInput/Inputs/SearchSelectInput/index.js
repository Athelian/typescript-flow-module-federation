// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import DebounceInput from 'react-debounce-input';
import Icon from 'components/Icon';
import BaseSelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import messages from 'components/Form/Inputs/messages';
import InputWrapper from '../InputWrapper';
import { SelectInputStyle, SelectOptionStyle, ArrowDownStyle, ClearButtonStyle } from './style';

type Props = {
  value: any | null,
  required?: boolean,
  onChange: any => void,
  onFocus: () => void,
  onBlur: () => void,
  items: Array<any>,
  filterItems: (string, Array<any>) => Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  focus: boolean,
};

const Select = ({
  clearSelection,
  required,
  getInputProps,
  getToggleButtonProps,
  selectedItem,
  isOpen,
}: RenderInputProps) => {
  const intl = useIntl();

  const { ref, ...inputProps } = getInputProps({
    spellCheck: false,
    placeholder: intl.formatMessage(messages.defaultSelectPlaceholder),
    onKeyDown: e => {
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        (isOpen && e.key === 'ArrowUp')
      ) {
        e.stopPropagation();
      }
    },
  });

  return (
    <div className={SelectInputStyle}>
      <DebounceInput debounceTimeout={500} inputRef={ref} {...inputProps} />

      {selectedItem && !required ? (
        <button className={ClearButtonStyle} type="button" onClick={() => clearSelection()}>
          <Icon icon="CLEAR" />
        </button>
      ) : (
        <button
          className={ArrowDownStyle(isOpen)}
          type="button"
          {...getToggleButtonProps({
            onKeyDown: e => {
              if (e.key === 'ArrowDown' || (isOpen && e.key === 'ArrowUp')) {
                e.stopPropagation();
              }
            },
          })}
        >
          <Icon icon="CHEVRON_DOWN" />
        </button>
      )}
    </div>
  );
};

const Option = ({ selected, highlighted, item, itemToString }: RenderOptionProps) => (
  <div className={SelectOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const SearchSelectInput = ({
  value,
  required,
  onChange,
  onFocus,
  onBlur,
  items,
  filterItems,
  itemToString,
  itemToValue,
  focus,
}: Props) => (
  <InputWrapper focus={focus} preselect>
    {({ ref }) => (
      <BaseSelectInput
        inputRef={ref}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        items={items}
        filterItems={filterItems}
        itemToString={itemToString}
        itemToValue={itemToValue}
        optionHeight={30}
        optionWidth={200}
        renderInput={Select}
        renderOption={Option}
      />
    )}
  </InputWrapper>
);

export default SearchSelectInput;
