// @flow
import * as React from 'react';
import type { RenderInputProps } from 'components/Inputs/SelectInput';
import { SelectInputStyle } from './style';

const MetricSelectInput = ({
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

export default MetricSelectInput;
