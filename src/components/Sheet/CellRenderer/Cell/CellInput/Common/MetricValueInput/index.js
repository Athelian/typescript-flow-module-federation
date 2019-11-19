// @flow
import * as React from 'react';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import { SelectOptionStyle, SelectInputStyle } from './style';

export const MetricSelectInput = ({
  isOpen,
  selectedItem,
  getToggleButtonProps,
  itemToString,
}: RenderInputProps) => (
  <button
    type="button"
    className={SelectInputStyle}
    {...getToggleButtonProps({
      onKeyDown: e => {
        if (e.key === 'ArrowDown' || (isOpen && e.key === 'ArrowUp')) {
          e.stopPropagation();
        }
      },
    })}
  >
    {itemToString(selectedItem)}
  </button>
);

export const MetricSelectOption = ({
  item,
  selected,
  highlighted,
  itemToString,
}: RenderOptionProps) => (
  <div className={SelectOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);
