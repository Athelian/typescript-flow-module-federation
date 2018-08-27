// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyledSearchSelectInput from 'components/Form/PureInputs/PureSearchSelectInput';
import {
  type StyledSearchSelectInputProps as Props,
  defaultStyledSearchSelectInputProps,
} from './type';
import {
  SelectWrapperStyle,
  InputStyle,
  ButtonStyle,
  OptionWrapperStyle,
  OptionStyle,
  ArrowDownStyle,
} from '../StyledSelectInput/style';

function SearchSelectInput({
  itemToString,
  itemToValue,
  items,
  forceHoverStyle,
  hasError,
  width,
  disabled,
  ...rest
}: Props) {
  return (
    <StyledSearchSelectInput
      styles={{ input: InputStyle, options: OptionWrapperStyle }}
      renderSelect={({ input, isOpen, toggle, clearSelection, selectedItem }) => (
        <div
          className={SelectWrapperStyle(
            hasError,
            isOpen,
            forceHoverStyle && !selectedItem,
            width,
            disabled
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

SearchSelectInput.defaultProps = defaultStyledSearchSelectInputProps;

export default SearchSelectInput;
