// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import PureSearchSelectInput from 'components/Form/PureInputs/PureSearchSelectInput';
import Display from 'components/Form/Display';
import DebounceInput from 'react-debounce-input';
import StyledDropDownList from '../components/StyledDropdownList';
import {
  type StyledSearchSelectInputProps as Props,
  defaultStyledSearchSelectInputProps,
} from './type';
import { SelectWrapperStyle, InputStyle, ClearButtonStyle, ArrowDownStyle } from '../style';

function SearchSelectInput({
  itemToString,
  itemToValue,
  items,
  forceHoverStyle,
  hasError,
  width,
  height,
  disabled,
  align,
  ...rest
}: Props) {
  return disabled ? (
    <Display align={align}> {rest.value}</Display>
  ) : (
    <PureSearchSelectInput
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
            height,
            disabled
          )}
        >
          {align === 'right' &&
            (selectedItem ? (
              <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
                <Icon icon="CLEAR" />
              </button>
            ) : (
              <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
                <Icon icon="CHEVRON_DOWN" />
              </button>
            ))}
          <DebounceInput
            className={InputStyle}
            onClick={toggle}
            debounceTimeout={500}
            spellCheck={false}
            style={{ textAlign: align }}
            {...getInputProps({
              value,
              onChange: handleQueryChange,
            })}
          />
          {align === 'left' &&
            (selectedItem ? (
              <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
                <Icon icon="CLEAR" />
              </button>
            ) : (
              <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
                <Icon icon="CHEVRON_DOWN" />
              </button>
            ))}
        </div>
      )}
      renderOptions={optionProps => (
        <StyledDropDownList
          items={items}
          itemToValue={itemToValue}
          itemToString={itemToString}
          {...optionProps}
        />
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
