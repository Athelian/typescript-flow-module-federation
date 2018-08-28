// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyledSearchSelectInput from 'components/Form/PureInputs/PureSearchSelectInput';
import Display from 'components/Form/Display';
import DebounceInput from 'react-debounce-input';
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
  return disabled ? (
    <Display align={rest.align}> {rest.value}</Display>
  ) : (
    <StyledSearchSelectInput
      renderSelect={({
        value,
        handleQueryChange,
        isOpen,
        toggle,
        selectedItem,
        clearSelection,
        getInputProps,
      }) => (
        <div
          className={SelectWrapperStyle(
            hasError,
            isOpen,
            forceHoverStyle && !selectedItem,
            width,
            disabled
          )}
        >
          <DebounceInput
            className={InputStyle}
            onClick={toggle}
            debounceTimeout={500}
            spellCheck={false}
            {...getInputProps({
              value,
              onChange: handleQueryChange,
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
      itemToString={itemToString}
      itemToValue={itemToValue}
      items={items}
      {...rest}
    />
  );
}

SearchSelectInput.defaultProps = defaultStyledSearchSelectInputProps;

export default SearchSelectInput;
