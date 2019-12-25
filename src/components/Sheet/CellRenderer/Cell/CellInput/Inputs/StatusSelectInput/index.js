// @flow
import * as React from 'react';
import SelectInput from 'components/Inputs/SelectInput';
import Icon from 'components/Icon';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { ArrowDownStyle, SelectInputStyle, SelectInputWrapperStyle, OptionStyle } from './style';

type Status = {
  value: string,
  label: string,
  color: string,
  textColor: string,
};

const StatusSelect = ({
  getToggleButtonProps,
  selectedItem,
  isOpen,
  itemToString,
}: RenderInputProps) => {
  return (
    <div className={SelectInputWrapperStyle(selectedItem?.color)}>
      <button
        type="button"
        className={SelectInputStyle(selectedItem?.textColor)}
        {...getToggleButtonProps({
          onKeyDown: e => {
            if (e.key === 'Enter') {
              if (isOpen) {
                e.stopPropagation();
              } else {
                e.preventDefault();
              }
            }
          },
        })}
      >
        {itemToString(selectedItem)}
      </button>

      <button
        className={ArrowDownStyle}
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
    </div>
  );
};

const StatusOption = ({ item, itemToString }: RenderOptionProps) => (
  <div className={OptionStyle(item.color, item.textColor)}>
    <span>{itemToString(item)}</span>
  </div>
);

const StatusSelectInput = ({
  value,
  readonly,
  onChange,
  extra,
}: InputProps<string, any, Array<Status>>) => (
  <SelectInput
    value={value}
    onChange={onChange}
    items={extra || []}
    itemToValue={i => i?.value ?? null}
    itemToString={i => i?.label ?? ''}
    renderInput={StatusSelect}
    renderOption={StatusOption}
    disabled={readonly}
    optionHeight={30}
    optionWidth={200}
  />
);

export default StatusSelectInput;
