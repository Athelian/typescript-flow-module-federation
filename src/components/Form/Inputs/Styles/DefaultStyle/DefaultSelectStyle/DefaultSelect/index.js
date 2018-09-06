// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { type RenderSelectProps } from 'components/Form/Inputs/SelectInput/type';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import { SelectInputStyle, ClearButtonStyle, ArrowDownStyle } from './style';

type OptionalProps = {
  required: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps &
  RenderSelectProps & {
    itemToString: any => string,
  };

const defaultProps = {
  required: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
  align: 'right',
};

function DefaultSelect({
  required,
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
  itemToString,
}: Props) {
  return (
    <div
      className={DefaultStyleWrapperStyle({
        type: 'standard',
        isFocused: isOpen,
        hasError,
        disabled,
        forceHoverStyle: forceHoverStyle && !selectedItem,
        width,
        height,
      })}
      style={{ cursor: 'pointer' }}
    >
      {align === 'right' &&
        (!required && selectedItem ? (
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
        onClick={toggle}
        className={SelectInputStyle(align)}
        {...getInputProps({
          value: itemToString(selectedItem),
        })}
      />
      {align === 'left' &&
        (!required && selectedItem ? (
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

DefaultSelect.defaultProps = defaultProps;

export default DefaultSelect;
