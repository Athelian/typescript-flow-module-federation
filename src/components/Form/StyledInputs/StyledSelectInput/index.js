// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import PureSelectInput from 'components/Form/PureInputs/PureSelectInput';
import Display from 'components/Form/Display';
import { type StyledSelectInputProps as Props, defaultStyledSelectInputProps } from './type';
import {
  SelectWrapperStyle,
  InputStyle,
  ButtonStyle,
  OptionWrapperStyle,
  OptionStyle,
  ArrowDownStyle,
} from './style';

function SelectInput({
  items,
  error,
  forceHoverStyle,
  itemToString,
  itemToValue,
  hasError,
  width,
  disabled,
  ...rest
}: Props) {
  return disabled ? (
    <Display align={rest.align}> {rest.value}</Display>
  ) : (
    <PureSelectInput
      items={items}
      itemToString={itemToString}
      itemToValue={itemToValue}
      clearIcon={<Icon icon="CLEAR" />}
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
      {...rest}
    />
  );
}

SelectInput.defaultProps = defaultStyledSelectInputProps;

export default SelectInput;
