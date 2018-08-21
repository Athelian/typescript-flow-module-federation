// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import BaseSearchSelectInput from 'components/base/SearchSelectInput';
import type { SearchSelectInputProps as Props } from './type.js.flow';
import {
  SelectWrapperStyle,
  InputStyle,
  ButtonStyle,
  OptionWrapperStyle,
  OptionStyle,
  ArrowDownStyle,
} from '../SelectInput/style';

function SearchSelectInput({
  itemToString,
  itemToValue,
  items,
  forceHoverStyle,
  errorMessage,
  width,
  ...rest
}: Props) {
  return (
    <BaseSearchSelectInput
      styles={{ input: InputStyle, options: OptionWrapperStyle }}
      renderSelect={({ input, isOpen, toggle, clearSelection, selectedItem }) => (
        <div
          className={SelectWrapperStyle(
            !!errorMessage,
            isOpen,
            !!forceHoverStyle && !selectedItem,
            width
          )}
        >
          {input}
          {selectedItem ? (
            <button type="button" onClick={clearSelection} className={ButtonStyle}>
              <Icon icon="CLEAR" />
            </button>
          ) : (
            <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
              <Icon icon="CHEVRON_DOWN" />
            </button>
          )}
        </div>
      )}
      renderOption={({ value: item, onHover, selected }) => (
        <div className={OptionStyle(onHover, selected)}>{itemToString(item)}</div>
      )}
      itemToString={itemToString}
      itemToValue={itemToValue}
      items={items}
      {...rest}
    />
  );
}

export default SearchSelectInput;
