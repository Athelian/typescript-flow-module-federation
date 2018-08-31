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
  forceHoverStyle,
  hasError,
  width,
  height,
  disabled,
  pureInputOptions,
}: Props) {
  const { align, value, items, itemToString, itemToValue } = pureInputOptions;

  return disabled ? (
    <Display align={align}>{value}</Display>
  ) : (
    <PureSearchSelectInput
      {...pureInputOptions}
      itemToString={itemToString}
      itemToValue={itemToValue}
      items={items}
      renderSelect={({
        value: inputValue,
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
              value: inputValue,
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
    />
  );
}

SearchSelectInput.defaultProps = defaultStyledSearchSelectInputProps;

export default SearchSelectInput;
