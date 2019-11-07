// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import Icon from 'components/Icon';
import BaseSelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import messages from 'components/Form/Inputs/messages';
import {
  SelectInputWrapperStyle,
  SelectInputStyle,
  ClearButtonStyle,
  ArrowDownStyle,
  SelectOptionStyle,
} from './style';

type Props = {
  value: any | null,
  required: boolean,
  onChange: any => void,
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
};

const Select = ({
  getToggleButtonProps,
  selectedItem,
  isOpen,
  itemToString,
  clearSelection,
  required,
}: RenderInputProps) => {
  const intl = useIntl();

  return (
    <div className={SelectInputWrapperStyle}>
      <button
        type="button"
        className={SelectInputStyle(!!selectedItem)}
        {...getToggleButtonProps({
          onKeyDown: e => {
            if (e.key === 'ArrowDown' || (isOpen && e.key === 'ArrowUp')) {
              e.stopPropagation();
            }
          },
        })}
      >
        {selectedItem
          ? itemToString(selectedItem)
          : intl.formatMessage(messages.defaultSelectPlaceholder)}
      </button>

      {selectedItem && !required ? (
        <button
          className={ClearButtonStyle}
          type="button"
          onClick={e => {
            e.stopPropagation();
            clearSelection();
          }}
        >
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

const SelectInput = ({ value, required, onChange, items, itemToString, itemToValue }: Props) => (
  <BaseSelectInput
    value={value}
    required={required}
    onChange={onChange}
    items={items}
    filterItems={(q, i) => i}
    itemToString={itemToString}
    itemToValue={itemToValue}
    optionHeight={30}
    optionWidth={200}
    renderInput={Select}
    renderOption={Option}
  />
);

export default SelectInput;
