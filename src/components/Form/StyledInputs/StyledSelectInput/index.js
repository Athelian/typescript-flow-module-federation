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
      renderSelect={({ isOpen, toggle, selectedItem, clearSelection, getInputProps }) => (
        <div
          className={SelectWrapperStyle(
            hasError,
            isOpen,
            forceHoverStyle && !selectedItem,
            width,
            disabled
          )}
        >
          <input
            readOnly
            spellCheck={false}
            className={InputStyle}
            onClick={toggle}
            {...getInputProps({
              value: itemToString(selectedItem),
            })}
          />
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
      renderOptions={({ highlightedIndex, selectedItem, getItemProps }) => (
        <div className={OptionWrapperStyle}>
          {items.map((item, index) => (
            <div
              key={itemToValue(item)}
              className={OptionStyle(highlightedIndex === index, selectedItem === item)}
              {...getItemProps({ item })}
            >
              {itemToString(item)}
            </div>
          ))}
        </div>
      )}
      {...rest}
    />
  );
}

SelectInput.defaultProps = defaultStyledSelectInputProps;

export default SelectInput;
