// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import PureSelectInput from 'components/Form/PureInputs/PureSelectInput';
import Display from 'components/Form/Display';
import StyledDropDownList from 'components/Form/StyledInputs/StyledSelectInput/components/StyledDropdownList';
import { type StyledSelectInputProps as Props, defaultStyledSelectInputProps } from './type';
import { SelectWrapperStyle, InputStyle, ClearButtonStyle, ArrowDownStyle } from './style';

function SelectInput({
  items,
  error,
  forceHoverStyle,
  itemToString,
  itemToValue,
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
          <input
            readOnly
            spellCheck={false}
            className={InputStyle}
            onClick={toggle}
            {...getInputProps({
              value: itemToString(selectedItem),
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
      {...rest}
    />
  );
}

SelectInput.defaultProps = defaultStyledSelectInputProps;

export default SelectInput;
