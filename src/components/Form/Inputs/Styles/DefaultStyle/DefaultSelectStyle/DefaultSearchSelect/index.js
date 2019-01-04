// @flow
import * as React from 'react';
import DebounceInput from 'react-debounce-input';
import Icon from 'components/Icon';
import { type RenderSearchSelectProps } from 'components/Form/Inputs/SearchSelectInput/type';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import {
  ClearButtonStyle,
  ArrowDownStyle,
} from 'components/Form/Inputs/Styles/DefaultStyle/DefaultSelectStyle/DefaultSelect/style';

type OptionalProps = {
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
  showClearButton: boolean,
};

type Props = OptionalProps &
  RenderSearchSelectProps & {
    hasError: boolean,
    disabled: boolean,
    forceHoverStyle: boolean,
    width: string,
    height: string,
  };

const defaultProps = {
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
  align: 'right',
  showClearButton: true,
};

function DefaultSearchSelect({
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  align,
  isOpen,
  clearSelection,
  toggle,
  selectedItem,
  getInputProps,
  value,
  handleQueryChange,
  itemToString,
  showClearButton,
  ...rest
}: Props) {
  return (
    <div
      className={DefaultStyleWrapperStyle({
        type: 'standard',
        isFocused: isOpen,
        hasError,
        disabled,
        forceHoverStyle,
        width,
        height,
      })}
    >
      {align === 'right' &&
        (showClearButton && selectedItem ? (
          <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
            <Icon icon="CLEAR" />
          </button>
        ) : (
          <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
            <Icon icon="CHEVRON_DOWN" />
          </button>
        ))}
      <DebounceInput
        onClick={toggle}
        debounceTimeout={500}
        spellCheck={false}
        style={{ textAlign: align }}
        {...getInputProps({
          value,
          onChange: handleQueryChange,
          ...rest,
        })}
      />
      {align === 'left' &&
        (showClearButton && selectedItem ? (
          <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
            <Icon icon="CLEAR" />
          </button>
        ) : (
          <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
            <Icon icon="CHEVRON_DOWN" />
          </button>
        ))}
    </div>
  );
}

DefaultSearchSelect.defaultProps = defaultProps;

export default DefaultSearchSelect;
